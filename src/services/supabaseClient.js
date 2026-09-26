import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jvhyspvwaphiqpwqbsgz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_EzpqyO3sCI95sI-vXpqUOQ_9j2jngn3';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
