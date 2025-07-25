
# EUNO Landing · «Ты знаешь, что ценно»

Одностраничный сайт‑лидогенератор на **HTML/CSS/JS** + небольшой **Node.js (Express)** бэкенд для отправки лидов в Telegram.

## Как запустить локально

```bash
git clone <repo> euno-landing
cd euno-landing
cp .env.example .env   # вставьте BOT_TOKEN и CHAT_ID
npm i
node server.js
```

Сайт будет доступен по адресу **http://localhost:3000**

## Развёртывание

- **Vercel / Render:** достаточно импортировать репозиторий.  
- **VPS (Ubuntu):** установите `pm2`, выполните команды выше, запустите `pm2 start server.js`.

## Стек

| Часть | Технология |
|-------|------------|
| Front‑end | Vanilla HTML + CSS (var‑root, flex, grid) + JS (IntersectionObserver) |
| Back‑end | Node.js 18 + Express + Axios |
| Интеграции | Telegram Bot API (уведомления) |
| Аналитика | Yandex.Metrika (ID замените в `index.html`) |
| SEO | Schema.org JSON‑LD `Organization` |

## Структура проекта

```
assets/
  css/styles.css
  js/script.js
  images/logo.png
server.js
index.html
privacy.html
terms.html
.env.example
```

## Лицензия

MIT
