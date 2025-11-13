module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  return res.json({ 
    status: 'OK', 
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
};
