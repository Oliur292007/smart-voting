const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  // Add CORS headers
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

    if (!nid || !nominee) {
      return res.status(400).json({ success: false, message: 'অনুগ্রহ করে সব তথ্য প্রদান করুন' });
    }

    const { data, error } = await supabase
      .from('votes')
      .insert([{ nid, nominee, timestamp: new Date() }]);

    if (error) {
      return res.json({ success: false, message: 'ভোট দিতে ব্যর্থ হয়েছে।' });
    }

    return res.json({ success: true, message: 'ভোট সফলভাবে দেওয়া হয়েছে।' });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ success: false, message: 'সার্ভার ত্রুটি!' });
  }
};
