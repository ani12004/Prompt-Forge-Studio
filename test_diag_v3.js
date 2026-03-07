const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://cnfmdfwpicltzthzglzj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZm1kZndwaWNsdHp0aHpnbHpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE2MzY3OSwiZXhwIjoyMDg0NzM5Njc5fQ.xbuadOWckDCoTHyTSYksmWNEghUwJ6l5I-8hgWd7pAw');

async function test() {
    try {
        console.log('--- Checking Versions & Schema ---');

        // 1. Check prompts again briefly
        const { data: prompts } = await supabase.from('v2_prompts').select('id, name, slug');
        console.log('Prompts:', prompts);

        // 2. Check versions
        const { data: versions, error: vError } = await supabase.from('v2_prompt_versions').select('*');
        if (vError) console.error('Versions Error:', vError);
        else {
            console.log('Total Versions:', versions.length);
            versions.forEach(v => console.log(`Version: ${v.version_tag}, PromptID: ${v.prompt_id}, Created: ${v.created_at}`));
        }

        // 3. Check for specific link (Audited Prompt)
        const auditedPrompt = prompts.find(p => p.slug === 'audited-prompt' || p.name === 'Audited Prompt');
        if (auditedPrompt) {
            console.log('Audited Prompt found:', auditedPrompt.id);
            const { data: linkedVersions } = await supabase.from('v2_prompt_versions').select('*').eq('prompt_id', auditedPrompt.id);
            console.log('Linked Versions for Audited Prompt:', linkedVersions);
        } else {
            console.log('Audited Prompt NOT found in list.');
        }

        console.log('--- End of Report ---');
    } catch (e) {
        console.error('Fatal Error:', e);
    }
}

test();
