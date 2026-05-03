const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;

module.exports = async function handler(req, res) {
  // 健康檢查
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', message: 'Webhook is running' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('收到請求 body:', JSON.stringify(req.body));

  const events = req.body.events;
  if (!events || events.length === 0) {
    return res.status(200).send('OK');
  }

  for (const event of events) {
    const userId = event.source?.userId;
    const replyToken = event.replyToken;

    // 處理照片
    if (event.type === 'message' && event.message?.type === 'image') {
      try {
        console.log(`收到照片 - 用戶: ${userId}, 照片ID: ${event.message.id}`);
        
        // 暫時不回覆，只記錄
        await replyMessage(replyToken, `✅ 收到照片！照片ID: ${event.message.id}`);
        
      } catch (error) {
        console.error('處理錯誤:', error.message);
        await replyMessage(replyToken, "❌ 處理失敗: " + error.message);
      }
    }
    
    // 處理文字
    if (event.type === 'message' && event.message?.type === 'text') {
      await replyMessage(replyToken, `收到文字: ${event.message.text}\n請傳送照片給我！`);
    }
  }

  res.status(200).send('OK');
};

async function replyMessage(token, text) {
  if (!token) return;
  
  try {
    const response = await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        replyToken: token,
        messages: [{ type: 'text', text: text }]
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('LINE API 錯誤:', response.status, errorText);
    }
  } catch (error) {
    console.error('回覆訊息錯誤:', error.message);
  }
}
