import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kpkgtzvnsknxcnkmhirn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_eM6WJ1xwJgobv-vqNzYUuA_8-tJKblY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});
