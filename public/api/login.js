import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  try {
    // --- CORS headers ---
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST')
      return res.status(405).json({ success: false, message: 'Method not allowed' });

    const { nid, upazila, district, division } = req.body || {};
    if (!nid || !upazila || !district || !division)
      return res.status(400).json({ success: false, message: 'সব তথ্য প্রদান করুন' });

    console.log('Checking voter:', { nid, upazila, district, division });

    // --- Validate voter ---
    const { data: voter, error } = await supabase
      .from('voters')
      .select('*')
      .eq('nid', nid)
      .eq('upazila', upazila)
      .eq('district', district)
      .eq('division', division)
      .maybeSingle(); // ✅ safer than .single()

    if (error) {
      console.error('Voter query error:', error);
      return res.status(500).json({ success: false, message: 'ডাটাবেস ত্রুটি!' });
    }

    if (!voter)
      return res.json({ success: false, message: 'ভুল তথ্য! ভোট দেওয়া যাবে না।' });

    // --- Check if already voted ---
    const { data: voteData, error: voteError } = await supabase
      .from('votes')
      .select('id')
      .eq('nid', nid);

    if (voteError) {
      console.error('Vote check error:', voteError);
      return res.status(500).json({ success: false, message: 'ডাটাবেস ত্রুটি!' });
    }

    if (voteData?.length > 0)
      return res.json({ success: false, message: 'আপনি ইতিমধ্যেই ভোট দিয়েছেন!' });

    return res.json({ success: true, message: 'ভোট দিতে পারবেন।' });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ success: false, message: 'সার্ভার ত্রুটি!' });
  }
}
