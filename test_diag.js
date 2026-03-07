const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://cnfmdfwpicltzthzglzj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZm1kZndwaWNsdHp0aHpnbHpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE2MzY3OSwiZXhwIjoyMDg0NzM5Njc5fQ.xbuadOWckDCoTHyTSYksmWNEghUwJ6l5I-8hgWd7pAw');

async function test() {
    try {
        console.log('--- Checking DB Status ---');
        const { data: prompts, error: pError } = await supabase.from('v2_prompts').select('user_id, name, slug');
        if (pError) console.error('Prompts Error:', pError);
        else console.log('Prompts in DB:', prompts.length, prompts);

        const { data: users, error: uError } = await supabase.from('profiles').select('id, username');
        if (uError) console.error('Profiles Error:', uError);
        else console.log('Profiles in DB:', users.length, users);

        console.log('--- End of Report ---');
    } catch (e) {
        console.error('Fatal Error:', e);
    }
}

test();
