"use server"

import { auth } from "@clerk/nextjs/server"
import { createClerkSupabaseClient } from "@/lib/supabaseClient"
import { revalidatePath } from "next/cache"

// Interfaces for our return types
export interface CommunityLike {
    id: string;
    post_id: string | null;
    reply_id: string | null;
    user_id: string;
}

export interface CommunityReply {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
    likesData?: CommunityLike[];
    likeCount: number;
    hasLiked: boolean;
}

export interface CommunityPost {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    repliesData?: CommunityReply[];
    likesData?: CommunityLike[];
    replies: CommunityReply[];
    likeCount: number;
    hasLiked: boolean;
}

export async function getCommunityPosts() {
    const { userId, getToken } = await auth();
    let supabase;

    // Unauthenticated users can still view posts using the anon key (assuming RLS allows it, which our policies do)
    if (userId) {
        const token = await getToken({ template: "supabase" });
        supabase = createClerkSupabaseClient(token);
    } else {
        // Fallback to a client with anon key if needed, or if createClerkSupabaseClient handles null tokens gracefully.
        // For simplicity, we just create a client without the custom auth header.
        const { createClient } = await import('@supabase/supabase-js');
        supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }

    // Fetch posts, ideally joining with replies and likes.
    // Due to Supabase RPC/Join limits on nested arrays, we fetch them and map manually or use a view.
    // For this implementation, we will fetch posts, then their replies and likes in separate queries or joined.

    const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select(`
            *,
            repliesData:community_replies(*, likesData:community_likes(*)),
            likesData:community_likes(*)
        `)
        .order('created_at', { ascending: false });

    if (postsError) {
        console.error("Error fetching posts:", postsError);
        return [];
    }

    // Format the response to calculate like counts and 'hasLiked' booleans
    const formattedPosts: CommunityPost[] = (postsData || []).map((post: any) => {

        const formatReply = (reply: any): CommunityReply => ({
            ...reply,
            likeCount: reply.likesData?.length || 0,
            hasLiked: userId ? reply.likesData?.some((l: CommunityLike) => l.user_id === userId) : false,
        });

        const replies = (post.repliesData || []).map(formatReply).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

        return {
            ...post,
            replies,
            likeCount: post.likesData?.length || 0,
            hasLiked: userId ? post.likesData?.some((l: CommunityLike) => l.user_id === userId) : false,
        };
    });

    return formattedPosts;
}

export async function createPost(content: string) {
    const { userId, getToken } = await auth();
    if (!userId) throw new Error("Unauthorized");
    if (!content.trim()) throw new Error("Content cannot be empty");

    const token = await getToken({ template: "supabase" });
    const supabase = createClerkSupabaseClient(token);

    const { data, error } = await supabase
        .from('community_posts')
        .insert({ user_id: userId, content: content.trim() })
        .select()
        .single();

    if (error) {
        console.error("Failed to create post:", error);
        throw new Error("Failed to create post");
    }

    revalidatePath("/community");
    return data;
}

export async function createReply(postId: string, content: string) {
    const { userId, getToken } = await auth();
    if (!userId) throw new Error("Unauthorized");
    if (!content.trim()) throw new Error("Content cannot be empty");

    const token = await getToken({ template: "supabase" });
    const supabase = createClerkSupabaseClient(token);

    const { data, error } = await supabase
        .from('community_replies')
        .insert({ post_id: postId, user_id: userId, content: content.trim() })
        .select()
        .single();

    if (error) {
        console.error("Failed to create reply:", error);
        throw new Error("Failed to create reply");
    }

    revalidatePath("/community");
    return data;
}

export async function toggleLike(targetType: 'post' | 'reply', targetId: string) {
    const { userId, getToken } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const token = await getToken({ template: "supabase" });
    const supabase = createClerkSupabaseClient(token);

    const columnMatch = targetType === 'post' ? 'post_id' : 'reply_id';

    // Check if like exists
    const { data: existingLike, error: findError } = await supabase
        .from('community_likes')
        .select('id')
        .eq('user_id', userId)
        .eq(columnMatch, targetId)
        .single();

    if (findError && findError.code !== 'PGRST116') {
        // PGRST116 means zero rows returned, which is fine
        console.error("Error finding like:", findError);
        throw new Error("Error fetching like status");
    }

    if (existingLike) {
        // Unlike
        const { error: deleteError } = await supabase
            .from('community_likes')
            .delete()
            .eq('id', existingLike.id);

        if (deleteError) {
            console.error("Error deleting like:", deleteError);
            throw new Error("Failed to unlike");
        }
    } else {
        // Like
        const { error: insertError } = await supabase
            .from('community_likes')
            .insert({ user_id: userId, [columnMatch]: targetId });

        if (insertError) {
            console.error("Error inserting like:", insertError);
            throw new Error("Failed to like");
        }
    }

    revalidatePath("/community");
    return { success: true, action: existingLike ? 'unliked' : 'liked' };
}
