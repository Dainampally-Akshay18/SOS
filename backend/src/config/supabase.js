const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Admin client with service role key (for server-side operations)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Regular client with anon key
const supabaseClient = createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY);

module.exports = {
  supabaseAdmin,
  supabaseClient
};
