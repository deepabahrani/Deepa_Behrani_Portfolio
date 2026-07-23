require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const portfolioHtmlPath = path.join(__dirname, 'Deepa_Behrani_Portfolio.html');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

function escapeHtml(value = '') {
  return value.replace(/[&<>"']/g, (char) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[char] || char;
  });
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/send-message', async (req, res) => {
  const { name, email, phone, message } = req.body || {};
  const trimmedName = String(name || '').trim();
  const trimmedEmail = String(email || '').trim();
  const trimmedPhone = String(phone || '').trim();
  const trimmedMessage = String(message || '').trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return res.status(400).json({ error: 'Name, email, and message are all required.' });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ error: 'Email server is not configured yet.' });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmedEmail)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: trimmedEmail,
      subject: `Portfolio message from ${trimmedName}`,
      text: [
        trimmedMessage,
        '',
        '---',
        trimmedName,
        trimmedEmail,
        trimmedPhone ? `Phone: ${trimmedPhone}` : null,
      ].filter(Boolean).join('\n'),
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1a1a1a;">
          <p>${escapeHtml(trimmedMessage).replace(/\n/g, '<br>')}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
          <p style="font-size: 14px; color: #555;">
            <strong>${escapeHtml(trimmedName)}</strong><br>
            <a href="mailto:${escapeHtml(trimmedEmail)}">${escapeHtml(trimmedEmail)}</a>
            ${trimmedPhone ? `<br>${escapeHtml(trimmedPhone)}` : ''}
          </p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/', (req, res) => res.sendFile(portfolioHtmlPath));

app.listen(PORT, () => {
  console.log(`Contact form server running on http://localhost:${PORT}`);
});
