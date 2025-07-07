#!/usr/bin/env node
import figlet from 'figlet';
import chalk from 'chalk';
import gradient from 'gradient-string';
import readline from 'readline';
import axios from 'axios';
import boxen from 'boxen';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const displayBanner = () => {
  const banner = figlet.textSync('LWMHR', { font: 'Big' }); // Changed font to 'Big'
  const coloredBanner = gradient.rainbow.multiline(banner); // Changed gradient to 'rainbow'
  console.log(coloredBanner);
  console.log(chalk.cyan(boxen('Welcome to LWMHR - Chat with Gemini API via Termux!', { padding: 1, margin: 1, borderStyle: 'round' })));
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getApiKey = () => {
  return new Promise((resolve) => {
    if (process.env.GEMINI_API_KEY) {
      resolve(process.env.GEMINI_API_KEY);
    } else {
      rl.question(chalk.yellow(boxen('Please enter your Gemini API Key: ', { padding: 1, margin: 1, borderStyle: 'single' })), (apiKey) => { // Added boxen to API key prompt
        fs.writeFileSync('.env', `GEMINI_API_KEY=${apiKey}`);
        process.env.GEMINI_API_KEY = apiKey;
        resolve(apiKey);
      });
    }
  });
};

const chatHistory = [];

const chatWithGemini = async (apiKey, message) => {
  try {
    const userMessage = { role: 'user', parts: [{ text: message }] };
    const contents = [...chatHistory, userMessage];

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: contents,
      }
    );

    if (response.data.candidates && response.data.candidates.length > 0 && response.data.candidates[0].content.parts) {
        const geminiContent = response.data.candidates[0].content;
        const text = geminiContent.parts[0].text;

        chatHistory.push(userMessage);
        chatHistory.push(geminiContent);

        console.log(boxen(chalk.green('Gemini:') + ' ' + text, { padding: 1, margin: 1, borderStyle: 'double', borderColor: 'green' })); // Added boxen to Gemini output
    } else {
        console.log(chalk.yellow('Gemini: Received an empty response.'));
    }

  } catch (error) {
    let errorMessage = error.message;
    if (error.response && error.response.data && error.response.data.error) {
        errorMessage = `[${error.response.status}] ${error.response.data.error.message}`;
    }
    console.error(chalk.red('Error communicating with Gemini API:'), errorMessage);
  }
};

const startChat = async () => {
  displayBanner();
  const apiKey = await getApiKey();

  console.log(chalk.blue('You can start chatting with Gemini. Type "exit" to quit.'));

  rl.on('line', async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }
    if (input.toLowerCase() === '--help' || input.toLowerCase() === 'help') {
        console.log(chalk.yellow('Commands:'));
        console.log(chalk.yellow('  exit    - Exit the chat'));
        console.log(chalk.yellow('  --help  - Show this help message'));
        rl.prompt();
        return;
    }
    await chatWithGemini(apiKey, input);
    rl.prompt();
  });

  rl.prompt();
};

startChat();%