import { createClient } from '@supabase/supabase-js';

// === Diagnostic logging (visible in Vercel Logs) ===
console.log('🔍 SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('🔍 SUPABASE_KEY exists:', !!process.env.SUPABASE_KEY);

let supabase;
try {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Missing Supabase environment variables.');
  }
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  console.log('✅ Supabase client initialized successfully.');
} catch (err) {
  console.error('❌ Supabase initialization failed:', err);
}

export default async function handler(req, res) {
  console.log('✅ /api/login called with method:', req.method);

  // --- CORS headers ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    console.warn('⚠️ Invalid method:', req.method);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    if (!supabase) {
      console.error('❌ Supabase client not initialized.');
      return res.status(500).json({ success: false, message: 'Supabase not initialized on server.' });
    }

    const { nid, upazila, district, division } = req.body || {};
    if (!nid || !upazila || !district || !division) {
      console.warn('⚠️ Missing input fields:', { nid, upazila, district, division });
      return res.status(400).json({ success: false, message: 'সব তথ্য প্রদান করুন' });
    }

    console.log('🔍 Checking voter:', { nid, upazila, district, division });

    // --- Check voter existence ---
    const { data: voter, error } = await supabase
      .from('voters')
      .select('*')
      .eq('nid', nid)
      .eq('upazila', upazila)
      .eq('district', district)
      .eq('division', division)
      .maybeSingle(); // ✅ prevents exception if empty

    if (error) {
      console.error('❌ Voter query error:', error);
      return res.status(500).json({ success: false, message: 'ডাটাবেস ত্রুটি!' });
    }

    if (!voter) {
      console.log('🚫 No matching voter found.');
      return res.json({ success: false, message: 'ভুল তথ্য! ভোট দেওয়া যাবে না।' });
    }

    // --- Check if already voted ---
    const { data: voteData, error: voteError } = await supabase
      .from('votes')
      .select('id')
      .eq('nid', nid);

    if (voteError) {
      console.error('❌ Vote check error:', voteError);
      return res.status(500).json({ success: false, message: 'ডাটাবেস ত্রুটি!' });
    }

    if (voteData?.length > 0) {
      console.log('🚫 Voter has already voted.');
      return res.json({ success: false, message: 'আপনি ইতিমধ্যেই ভোট দিয়েছেন!' });
    }

    // --- All good ---
    console.log('✅ Login successful, voter can vote.');
    return res.json({ success: true, message: 'ভোট দিতে পারবেন।' });

  } catch (error) {
    console.error('❌ Server error:', error);
    return res.status(500).json({ success: false, message: 'সার্ভার ত্রুটি!' });
  }
}
