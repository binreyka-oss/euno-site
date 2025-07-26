export default async function handler(request, response) {
  // 1. Принимаем только POST запросы, остальные отклоняем
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  // 2. Получаем секретные ключи из переменных окружения Vercel
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return response.status(500).json({ message: 'Telegram bot credentials are not configured.' });
  }

  // 3. Получаем данные из формы (из тела запроса)
  const { name, phone, email, company } = request.body;

  // 4. Формируем красивое сообщение для Telegram (используем Markdown)
  let message = `*Новая заявка с сайта EUNO!*\n\n`;
  message += `*Имя:* ${name}\n`;
  message += `*Телефон:* ${phone}\n`;
  message += `*Email:* ${email}\n`;
  if (company) {
    message += `*Компания:* ${company}\n`;
  }

  // 5. Собираем URL для отправки в Telegram API
  const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    // 6. Отправляем запрос в Telegram API
    const telegramResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown', // Включаем разметку для жирного текста и т.д.
      }),
    });

    const telegramResult = await telegramResponse.json();

    // 7. Проверяем, успешно ли Telegram принял сообщение
    if (!telegramResult.ok) {
      throw new Error(telegramResult.description);
    }

    // 8. Отправляем успешный ответ обратно на сайт
    response.status(200).json({ message: 'Success' });

  } catch (error) {
    // В случае ошибки, логируем её и отправляем ошибку на сайт
    console.error('Error sending message to Telegram:', error);
    response.status(500).json({ message: 'Error sending message' });
  }
}
