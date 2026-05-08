require('dotenv').config();
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { generateReply } = require('./openai');

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './session', clientId: 'whatsapp-ai-bot' }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  }
});

client.on('qr', (qr) => {
  console.log('QR code received. Scan it with WhatsApp:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp client is ready.');
});

client.on('auth_failure', (message) => {
  console.error('Authentication failure:', message);
});

client.on('authenticated', () => {
  console.log('Authenticated successfully. Session saved.');
});

client.on('disconnected', (reason) => {
  console.warn('Client disconnected:', reason);
});

client.on('message', async (message) => {
  try {
    if (message.fromMe) {
      return;
    }

    const incoming = message.body?.trim();
    if (!incoming) {
      return;
    }

    console.log(`Received message from ${message.from}: ${incoming}`);

    const reply = await generateReply(incoming);
    await message.reply(reply);

    console.log(`Sent reply to ${message.from}`);
  } catch (error) {
    console.error('Error handling message:', error);
  }
});

client.initialize();
