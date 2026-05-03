// api/index.js 或 api/webhook.js
module.exports = async function handler(req, res) {
  console.log('Request received:', req.method);
  
  // 回應 GET 請求（測試用）
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok', 
      message: 'Server is running',
      time: new Date().toISOString()
    });
  }
  
  // 回應 POST 請求（LINE Webhook）
  if (req.method === 'POST') {
    console.log('POST body:', req.body);
    return res.status(200).send('OK');
  }
  
  return res.status(405).send('Method Not Allowed');
};
