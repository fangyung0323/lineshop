// api/webhook.js - 超簡單測試版
module.exports = async function handler(req, res) {
  // 允許 GET 請求來測試函數是否正常
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      message: 'Webhook is alive!',
      time: new Date().toISOString()
    });
  }

  // LINE 會用 POST
  if (req.method === 'POST') {
    console.log('收到 POST 請求');
    console.log('Body:', JSON.stringify(req.body));
    
    // 簡單回應 LINE
    return res.status(200).send('OK');
  }

  // 其他方法
  return res.status(405).json({ error: 'Method not allowed' });
};
