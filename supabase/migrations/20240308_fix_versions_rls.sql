-- FIX: Ensure versions can be inserted and viewed correctly
-- Drop old all-in-one policy
DROP POLICY IF EXISTS "v2_versions_owner_all" ON public.v2_prompt_versions;
DROP POLICY IF EXISTS "v2_versions_public_select" ON public.v2_prompt_versions;

-- 1. Explicit Select Policy for public prompts
CREATE POLICY "v2_versions_public_select" ON public.v2_prompt_versions FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.v2_prompts WHERE public.v2_prompts.id = public.v2_prompt_versions.prompt_id AND is_public = true));

-- 2. Explicit Owner Policy for all operations
CREATE POLICY "v2_versions_owner_access" ON public.v2_prompt_versions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.v2_prompts 
    WHERE public.v2_prompts.id = public.v2_prompt_versions.prompt_id 
    AND (public.v2_prompts.user_id::text = (auth.jwt() ->> 'sub')::text OR public.v2_prompts.user_id::text = auth.uid()::text)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.v2_prompts 
    WHERE public.v2_prompts.id = public.v2_prompt_versions.prompt_id 
    AND (public.v2_prompts.user_id::text = (auth.jwt() ->> 'sub')::text OR public.v2_prompts.user_id::text = auth.uid()::text)
  )
);

-- 3. Ensure is_public defaults to true if missing
ALTER TABLE public.v2_prompts ALTER COLUMN is_public SET DEFAULT true;

NOTIFY pgrst, 'reload schema';
