import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// MUST BE ANON KEY. NEVER SERVICE_ROLE.
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
