
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.post('/api/lead', async (req, res)=>{
  const {name, phone, email, company} = req.body;
  if(!name || !phone || !email){
    return res.status(400).json({error:'invalid'});
  }
  const message = `
🔔 Новая заявка с сайта:
👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email}
🏢 Компания: ${company || '-'}
  `;
  try{
    await axios.post(\`https://api.telegram.org/bot\${process.env.BOT_TOKEN}/sendMessage\`,{
      chat_id: process.env.CHAT_ID,
      text: message,
      parse_mode:'HTML'
    });
    res.json({status:'ok'});
  }catch(err){
    console.error(err.response ? err.response.data : err.message);
    res.status(500).json({error:'telegram'});
  }
});

app.listen(PORT, ()=> console.log('Server running on '+PORT));
