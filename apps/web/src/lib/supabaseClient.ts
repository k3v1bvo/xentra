import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hvreacspnorswmfabtei.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2cmVhY3Nwbm9yc3dtZmFidGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ0NDI5MTYsImV4cCI6MjExMDAxODkxNn0.a9bQyAf8gSAbGGieqdKvP7AsHVUMInDaxXBOz0FRI6Q';

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
