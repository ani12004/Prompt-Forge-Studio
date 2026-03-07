const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://cnfmdfwpicltzthzglzj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZm1kZndwaWNsdHp0aHpnbHpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE2MzY3OSwiZXhwIjoyMDg0NzM5Njc5fQ.xbuadOWckDCoTHyTSYksmWNEghUwJ6l5I-8hgWd7pAw');

async function test() {
    try {
        console.log('--- Checking DB Status (Detailed) ---');
        const { data: prompts, error: pError } = await supabase.from('v2_prompts').select('id, user_id, name, is_public');
        if (pError) console.error('Prompts Error:', pError);
        else {
            console.log('Total Prompts:', prompts.length);
            prompts.forEach(p => console.log(`Prompt: ${p.name}, User: ${p.user_id}, Public: ${p.is_public}`));
        }
        console.log('--- End of Report ---');
    } catch (e) {
        console.error('Fatal Error:', e);
    }
}

test();
