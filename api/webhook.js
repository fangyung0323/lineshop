// api/webhook.js
module.exports = async function handler(req, res) {
  console.log('Webhook called:', req.method);
  
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok', 
      message: 'Webhook is alive!',
      time: new Date().toISOString()
    });
  }
  
  if (req.method === 'POST') {
    console.log('Received webhook:', JSON.stringify(req.body));
    return res.status(200).send('OK');
  }
  
  return res.status(405).send('Method Not Allowed');
};
