import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const users = [
  { email: 'admin_bhai@test.pk', password: 'password123' },
  { email: 'jigar_user@test.pk', password: 'password123' },
  { email: 'chota_guest@test.pk', password: 'password123' }
];

async function seed() {
  console.log('Seeding shuru kar raha hoon bhai...');
  for (const u of users) {
    const { data, error } = await supabase.auth.signUp({ email: u.email, password: u.password });
    if (error) {
      console.log(`Masla aa gaya ${u.email} ke sath:`, error.message);
    } else {
      console.log(`Zabardast! User ban gaya: ${u.email} (ID: ${data.user?.id})`);
    }
  }
  console.log('Seeding khatam. Scene fit hai.');
}

seed();
