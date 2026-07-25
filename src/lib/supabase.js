import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://frmwqyraqqnxxgfvllhw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_HvnXXioDNKEkOEzDhRYJzw_HawDORPo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
