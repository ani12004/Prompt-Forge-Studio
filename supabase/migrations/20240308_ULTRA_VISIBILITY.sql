-- ULTRA VISIBILITY FIX: Remove all RLS blocks for SELECT on public tables
-- This ensures prompts and versions are ALWAYS visible if they exist.

DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename IN ('v2_prompts', 'v2_prompt_versions', 'profiles')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END
$$;

-- 1. PROFILES: Anyone can view, only owner can edit
CREATE POLICY "profiles_public_select_v3" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_owner_all_v3" ON public.profiles FOR ALL 
USING (id::text = (auth.jwt() ->> 'sub')::text)
WITH CHECK (id::text = (auth.jwt() ->> 'sub')::text);

-- 2. PROMPTS: Anyone can view ALL prompts (since they are meant for a marketplace)
-- We remove the is_public check temporarily to ensure EVERYTHING shows up while debugging
CREATE POLICY "v2_prompts_public_select_v3" ON public.v2_prompts FOR SELECT USING (true);
CREATE POLICY "v2_prompts_owner_all_v3" ON public.v2_prompts FOR ALL 
USING (user_id::text = (auth.jwt() ->> 'sub')::text)
WITH CHECK (user_id::text = (auth.jwt() ->> 'sub')::text);

-- 3. VERSIONS: Anyone can view ALL versions
CREATE POLICY "v2_versions_public_select_v3" ON public.v2_prompt_versions FOR SELECT USING (true);
CREATE POLICY "v2_versions_owner_all_v3" ON public.v2_prompt_versions FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.v2_prompts 
    WHERE public.v2_prompts.id = public.v2_prompt_versions.prompt_id 
    AND public.v2_prompts.user_id::text = (auth.jwt() ->> 'sub')::text
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.v2_prompts 
    WHERE public.v2_prompts.id = public.v2_prompt_versions.prompt_id 
    AND public.v2_prompts.user_id::text = (auth.jwt() ->> 'sub')::text
  )
);

-- Force RLS enable
ALTER TABLE public.v2_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_prompt_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

NOTIFY pgrst, 'reload schema';
