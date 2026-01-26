import { createClient } from "@supabase/supabase-js"

/**
 * Creates a Supabase client authenticated with the user's Clerk session.
 * 
 * @param clerkToken - The JWT token from Clerk (await getToken({ template: 'supabase' }))
 */
export const createClerkSupabaseClient = (clerkToken?: string | null) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createClient(supabaseUrl, supabaseKey, {
        global: {
            headers: clerkToken ? { Authorization: `Bearer ${clerkToken}` } : undefined,
        },
    })
}
