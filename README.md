# Portfolio Contact Form — Backend

A tiny Express server with one job: when someone submits the contact form on your
portfolio, this emails the message straight to your inbox using Nodemailer + Gmail.

## 1. Install

```bash
npm install
```

## 2. Set up a Gmail App Password

Gmail won't let regular apps log in with your normal password, so you need an
**App Password** instead:

1. Turn on 2-Step Verification on your Google account, if it isn't already:
   https://myaccount.google.com/security
2. Go to https://myaccount.google.com/apppasswords
3. Create an app password (name it anything, e.g. "Portfolio site")
4. Copy the 16-character password it gives you

## 3. Configure environment variables

```bash
cp .env.example .env
```

Then open `.env` and fill in:
- `EMAIL_USER` — your Gmail address (deepabahrani22@gmail.com)
- `EMAIL_PASS` — the App Password from step 2

## 4. Run it locally

```bash
npm start
```

The server runs at `http://localhost:3000`. Test it with:

```bash
curl -X POST http://localhost:3000/send-message \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Hello!"}'
```

You should get the email within a few seconds.

## 5. Point the portfolio site at this server

In `Deepa_Behrani_Portfolio.html`, find this line near the bottom `<script>` block:

```js
const CONTACT_API_URL = 'http://localhost:3000/send-message';
```

- While testing locally, leave it as-is.
- Once deployed (step 6), replace it with your live URL, e.g.
  `https://your-app-name.onrender.com/send-message`.

## 6. Deploy it somewhere free

`localhost` only works on your own machine — to make the form work for real
visitors, deploy this folder to a host that keeps a server running. Free options:

- **Render** (render.com) — easiest: "New Web Service" → connect this folder/repo →
  set `EMAIL_USER` and `EMAIL_PASS` in the Environment tab → deploy.
- **Railway** (railway.app) — similar flow, generous free tier.
- **Cyclic** or **Fly.io** — also work well for small Express apps.

Whichever you pick, set `EMAIL_USER` and `EMAIL_PASS` as environment variables in
their dashboard (not in a committed `.env` file), then update `CONTACT_API_URL` in
the HTML file to your new live URL.

## Notes

- This uses Gmail's SMTP directly. For higher volume or better deliverability
  later, services like Resend, SendGrid, or Postmark are worth a look — but for a
  portfolio's contact form, Gmail + Nodemailer is plenty.
- CORS is open to all origins by default. If you want to lock it down to only your
  portfolio's domain once deployed, restrict it in `app.js`:
  `app.use(cors({ origin: 'https://your-portfolio-domain.com' }));`
