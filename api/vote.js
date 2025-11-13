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
    const { nid, nominee } = req.body;

    // Check if environment variables are set
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      console.error('Missing environment variables');
      return res.status(500).json({ success: false, message: 'সার্ভার কনফিগারেশন ত্রুটি' });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

    // Insert vote - matches your votes table schema exactly
    const { data, error } = await supabase
      .from('votes')
      .insert([{ 
        nid: nid, 
        nominee: nominee, 
        timestamp: new Date().toISOString() 
      }]);

    if (error) {
      console.error('Vote insert error:', error);
      
      // Handle foreign key violation (voter not found in voters table)
      if (error.code === '23503') {
        return res.status(400).json({ success: false, message: 'ভোটার রেকর্ড পাওয়া যায়নি' });
      }
      
      return res.status(500).json({ success: false, message: 'ভোট দিতে ব্যর্থ হয়েছে।' });
    }

    return res.status(200).json({ success: true, message: 'ভোট সফলভাবে দেওয়া হয়েছে।' });

  } catch (error) {
    console.error('Vote API error:', error);
    return res.status(500).json({ success: false, message: 'সার্ভার ত্রুটি হয়েছে' });
  }
}
