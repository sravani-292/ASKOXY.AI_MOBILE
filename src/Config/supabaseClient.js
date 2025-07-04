import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://glmdosgvqbnejuzyambk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsbWRvc2d2cWJuZWp1enlhbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTMwMDUsImV4cCI6MjA2NjQyOTAwNX0.Ga7oCIaQMp_AyQkjPczW-qC70Z795S1foGeGNMNtcLM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
