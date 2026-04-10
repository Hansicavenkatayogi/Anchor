import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

// Load from .env.local for script
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "YOUR_SERVICE_KEY";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log("Seeding database...");

  // 1. Orgs
  const { data: org1, error: e1 } = await supabase.from('ngo_organizations').insert({
    name: 'Childcare Foundation', type: 'ngo', city: 'Hyderabad', state: 'Telangana', verified: true, contact_email: 'hello@childcare.org'
  }).select().single();
  
  if (e1) console.error(e1);

  const { data: org2, error: e2 } = await supabase.from('ngo_organizations').insert({
    name: 'Hope Hands', type: 'ngo', city: 'Hyderabad', state: 'Telangana', verified: true, contact_email: 'contact@hopehands.org'
  }).select().single();

  if(org1) {
    // 2. Users (dummy password verification in auth.ts accepts "password")
    await supabase.from('ngo_users').insert({
      org_id: org1.id, name: 'Priya Sharma', email: 'priya@childcare.org', role: 'admin'
    });

    // 3. Activity Case
    const { data: c1 } = await supabase.from('cases').insert({
      id: 'HS-8472', category: 'food', category_label: 'Food', description: 'Need daily meals for 2 siblings.', urgency: 'high', city: 'Hyderabad', state: 'Telangana', family_situation: 'Single Parent', age_group: '10-14', anonymous_id: 'A1B2C3'
    }).select().single();

    if(c1) {
      await supabase.from('case_activity_log').insert({ case_id: c1.id, actor_type: 'system', action: 'submitted' });
    }
  }

  console.log("Done.");
}

main();
