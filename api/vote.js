import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { nid, nominee } = req.body;

  const { data, error } = await supabase
    .from('votes')
    .insert([{ nid, nominee, timestamp: new Date() }]);

  if(error) return res.json({ success: false, message: 'ভোট দিতে ব্যর্থ হয়েছে।' });

  return res.json({ success: true, message: 'ভোট সফলভাবে দেওয়া হয়েছে।' });
}