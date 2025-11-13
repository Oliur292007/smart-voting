export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  return res.status(200).json({ 
    status: 'OK', 
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
}
