
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'hopespark-ngo/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables. Make sure hopespark-ngo/.env.local contains NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  const tables = ['cases', 'ngo_organizations', 'ngo_users', 'aid_offers'];
  
  console.log("--- Database Status Summary ---");
  
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error(`- ${table}: Error - ${error.message}`);
    } else {
      console.log(`- ${table}: ${count} rows`);
    }
  }
}

checkDatabase();
