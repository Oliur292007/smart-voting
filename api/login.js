import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { nid, upazila, district, division } = req.body;

  // Validate voter
  const { data: voter, error } = await supabase
    .from('voters')
    .select('*')
    .eq('nid', nid)
    .eq('upazila', upazila)
    .eq('district', district)
    .eq('division', division)
    .single();

  if(error || !voter) return res.json({ success: false, message: 'ভুল তথ্য! ভোট দেওয়া যাবে না।' });

  // Check if already voted
  const { data: voteData } = await supabase
    .from('votes')
    .select('*')
    .eq('nid', nid);

  if(voteData.length > 0) return res.json({ success: false, message: 'আপনি ইতিমধ্যেই ভোট দিয়েছেন!' });

  return res.json({ success: true, message: 'ভোট দিতে পারবেন।' });
}