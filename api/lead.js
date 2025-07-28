
export default async function handler(request, response) {
  // 1. Принимаем только POST запросы
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  // 2. Получаем секретные ключи из переменных окружения Vercel
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Проверяем, что ключи вообще существуют
  if (!botToken || !chatId) {
    console.error('Telegram credentials not configured in Vercel environment variables.');
    return response.status(500).json({ message: 'Server configuration error.' });
  }

  try {
    // 3. Получаем данные из формы
    const { name, phone, email, company } = request.body;

    // 4. Формируем сообщение для Telegram
    let message = `*Новая заявка с сайта EUNO!*\n\n`;
    message += `*Имя:* ${name}\n`;
    message += `*Телефон:* ${phone}\n`;
    message += `*Email:* ${email}\n`;
    if (company) {
      message += `*Компания:* ${company}\n`;
    }
    
    // 5. Готовим и отправляем запрос в Telegram API
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const telegramResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const telegramResult = await telegramResponse.json();

    // 6. Проверяем, что Telegram ответил успехом
    if (!telegramResult.ok) {
      console.error('Telegram API Error:', telegramResult.description);
      throw new Error(telegramResult.description);
    }

    // 7. Отправляем успешный ответ на сайт
    return response.status(200).json({ message: 'Success' });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return response.status(500).json({ message: 'Failed to send message.' });
  }
}
