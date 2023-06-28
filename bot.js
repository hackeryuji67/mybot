const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const math = require('mathjs');
const financequote = require('financequote');

const client = new Client();

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
  console.log('Authenticated');
});

client.on('auth_failure', (error) => {
  console.error('Authentication failed:', error.message);
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', async (message) => {
  const { body, from } = message;

  if (body === 'hello') {
    client.sendMessage(from, 'Hello there!');
  } else if (body.startsWith('/profitloss')) {
    const args = body.split(' ');
    if (args.length === 3) {
      const costPrice = parseFloat(args[1]);
      const sellingPrice = parseFloat(args[2]);
      const profitLoss = sellingPrice - costPrice;
      client.sendMessage(from, `Profit/Loss: ${profitLoss}`);
    } else {
      client.sendMessage(from, 'Invalid arguments. Usage: /profitloss <cost_price> <selling_price>');
    }
  } else if (body.startsWith('/financialadvice')) {
    const advice = financequote.getRandomAdvice();
    client.sendMessage(from, `Financial Advice: ${advice}`);
  } else if (body.startsWith('/calculatemoney')) {
    const expression = body.substring(body.indexOf(' ') + 1);
    try {
      const result = math.evaluate(expression);
      client.sendMessage(from, `Result: ${result}`);
    } catch (error) {
      client.sendMessage(from, 'Invalid expression.');
    }
  } else if (body.startsWith('/createlogos')) {
    client.sendMessage(from, 'Logo creation functionality is under development.');
  }
});

client.initialize();
