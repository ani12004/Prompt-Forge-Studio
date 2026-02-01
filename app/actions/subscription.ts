"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabaseClient";

export async function getUserSubscription() {
    try {
        const { userId, getToken } = await auth();
        if (!userId) return "free";

        const token = await getToken({ template: "supabase" });
        const supabase = createClerkSupabaseClient(token);

        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_tier')
            .eq('user_id', userId)
            .single();

        return (profile?.subscription_tier || "free").toLowerCase();
    } catch (error) {
        console.error("Error fetching subscription:", error);
        return "free";
    }
}
