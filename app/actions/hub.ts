"use server"

import { auth, currentUser } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabaseClient";

export async function publishToHub(data: {
    name: string;
    description: string;
    template: string;
    system_prompt?: string;
    category?: string;
    tags?: string[];
}): Promise<{ success: boolean; error?: string; slug?: string }> {
    try {
        const { userId, getToken } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return { success: false, error: "Authentication Required" };
        }

        const token = await getToken({ template: "supabase" });
        const supabase = createClerkSupabaseClient(token);

        // 1. Ensure profile exists (with username)
        const username = user.username || user.firstName?.toLowerCase() || `user_${userId.slice(-5)}`;

        await supabase.from('profiles').upsert({
            id: userId,
            username: username,
            full_name: user.fullName,
            avatar_url: user.imageUrl,
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

        // 2. Prepare slug
        const slug = data.name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');

        // 3. Insert or Update Prompt (v2_prompts)
        const { data: promptEntry, error: promptError } = await supabase
            .from('v2_prompts')
            .upsert({
                user_id: userId,
                name: data.name,
                description: data.description,
                slug: slug,
                category: data.category || 'General',
                tags: data.tags || [],
                is_public: true, // Specifically for the Hub
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id, slug' })
            .select()
            .single();

        if (promptError) {
            console.error("Hub Publish Error (Prompt):", promptError);
            return { success: false, error: "Failed to create Hub entry." };
        }

        // 4. Create Version (v2_prompt_versions)
        const { error: versionError } = await supabase
            .from('v2_prompt_versions')
            .insert({
                prompt_id: promptEntry.id,
                version_tag: '1.0.0', // Initial version from Studio audit
                template: data.template,
                system_prompt: data.system_prompt || '',
                created_at: new Date().toISOString()
            });

        if (versionError) {
            console.error("Hub Publish Error (Version):", versionError);
            return { success: false, error: "Failed to create prompt version." };
        }

        return { success: true, slug: `${username}/${slug}` };

    } catch (error: any) {
        console.error("Hub Publish Catch Error:", error);
        return { success: false, error: "An unexpected error occurred during publication." };
    }
}
