const axios = require('axios');

const GOOGLE_SHEET_WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL;
const SECRET_KEY = process.env.SECRET_KEY;
const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;

module.exports = async function handler(req, res) {
  // 只接受 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const events = req.body.events;
  if (!events || events.length === 0) {
    return res.status(200).send('OK');
  }

  for (const event of events) {
    const userId = event.source.userId;
    const replyToken = event.replyToken;

    // 處理照片訊息
    if (event.type === 'message' && event.message.type === 'image') {
      try {
        console.log(`收到照片，用戶: ${userId}, 照片ID: ${event.message.id}`);

        // 寫入 Google Sheets
        await axios.post(GOOGLE_SHEET_WEBHOOK_URL, {
          secret: SECRET_KEY,
          userId: userId,
          imageId: event.message.id,
          timestamp: new Date().toISOString()
        });

        // 回覆用戶
        await replyMessage(replyToken, "✅ 照片已收到，已記錄至表單！");

      } catch (error) {
        console.error('處理照片錯誤:', error.message);
        await replyMessage(replyToken, "❌ 處理失敗，請稍後再試");
      }
    }
    
    // 處理文字訊息（可選）
    if (event.type === 'message' && event.message.type === 'text') {
      await replyMessage(replyToken, "請傳送照片給我，我會幫你記錄下來！");
    }
  }

  res.status(200).send('OK');
};

async function replyMessage(token, text) {
  try {
    await axios.post('https://api.line.me/v2/bot/message/reply', {
      replyToken: token,
      messages: [{ type: 'text', text: text }]
    }, {
      headers: { 
        'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('回覆訊息錯誤:', error.response?.data || error.message);
  }
}
