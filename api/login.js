import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { nid, upazila, district, division } = req.body;

    // Check if environment variables are set
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      console.error('Missing environment variables');
      return res.status(500).json({ success: false, message: 'সার্ভার কনফিগারেশন ত্রুটি' });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

    // Validate voter
    const { data: voter, error: voterError } = await supabase
      .from('voters')
      .select('*')
      .eq('nid', nid)
      .eq('upazila', upazila)
      .eq('district', district)
      .eq('division', division)
      .single();

    if (voterError || !voter) {
      return res.status(401).json({ success: false, message: 'ভুল তথ্য! ভোট দেওয়া যাবে না।' });
    }

    // Check if already voted
    const { data: voteData, error: voteError } = await supabase
      .from('votes')
      .select('*')
      .eq('nid', nid);

    if (voteError) {
      console.error('Vote check error:', voteError);
      return res.status(500).json({ success: false, message: 'ডেটাবেস ত্রুটি' });
    }

    if (voteData && voteData.length > 0) {
      return res.status(400).json({ success: false, message: 'আপনি ইতিমধ্যেই ভোট দিয়েছেন!' });
    }

    return res.status(200).json({ success: true, message: 'ভোট দিতে পারবেন।' });

  } catch (error) {
    console.error('Login API error:', error);
    return res.status(500).json({ success: false, message: 'সার্ভার ত্রুটি হয়েছে' });
  }
      }
