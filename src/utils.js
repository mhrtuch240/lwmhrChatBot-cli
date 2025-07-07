import chalk from 'chalk';
import gradient from 'gradient-string';
import boxen from 'boxen';
import fs from 'fs';
import stripAnsi from 'strip-ansi';
import { MESSAGES, PROMPTS } from './constants.js';

const padToWidth = (text, targetWidth) => {
  const strippedText = stripAnsi(text);
  const paddingNeeded = Math.max(0, targetWidth - strippedText.length);
  return text + ' '.repeat(paddingNeeded);
};

export const displayBanner = () => {
  const bannerText = `
  ██╗      ██╗    ██╗███╗   ███╗██╗  ██╗██████╗
  ██║      ██║    ██║████╗ ████║██║  ██║██╔══██╗
  ██║     ╗██║ █╗ ██║██╔████╔██║███████║██████╔╝
  ██║╚════╝██║███╗██║██║╚██╔╝██║██╔══██║██╔══██╗
  ███████╗ ╚███╔ Mahedi Hasan Rafsun / v2.0.0
  `;
  const coloredBanner = gradient.rainbow.multiline(bannerText);

  const subtitle = chalk.yellow('Powered by Mahedi Hasan Rafsun');
  const description = chalk.cyan('Chat with Gemini via Termux, Linux, Node.js');

  // Calculate the maximum visible width of the content lines
  const allLines = [
    ...coloredBanner.split('\n'),
    subtitle,
    description
  ];
  let maxWidth = 0;
  for (const line of allLines) {
    const visibleWidth = stripAnsi(line).length;
    if (visibleWidth > maxWidth) {
      maxWidth = visibleWidth;
    }
  }

  // Pad each line to the maxWidth
  const paddedBannerLines = coloredBanner.split('\n').map(line => padToWidth(line, maxWidth));
  const paddedSubtitle = padToWidth(subtitle, maxWidth);
  const paddedDescription = padToWidth(description, maxWidth);

  const combinedContent = `
${paddedBannerLines.join('\n')}
${paddedSubtitle}

${paddedDescription}
`;

  console.log(boxen(combinedContent, {
    padding: {
      top: 1,
      bottom: 1,
      left: 2,
      right: 2,
    },
    margin: 1,
    borderStyle: 'round',
    borderColor: 'blue',
    align: 'center',
    width: 100, // Set a fixed width for the banner
    align: 'center', // Center align the content
    safe: true,
  }));
};

export const getApiKey = (rl) => {
  return new Promise((resolve, reject) => {
    if (process.env.GEMINI_API_KEY) {
      resolve(process.env.GEMINI_API_KEY);
    } else {
      rl.question(chalk.yellow(boxen(PROMPTS.API_KEY, { padding: 1, margin: 1, borderStyle: 'single' })), (apiKey) => {
        if (apiKey) {
          try {
            fs.writeFileSync('.env', `GEMINI_API_KEY=${apiKey}`);
            process.env.GEMINI_API_KEY = apiKey;
            resolve(apiKey);
          } catch (error) {
            reject(new Error(`Failed to write API key to .env file: ${error.message}`));
          }
        } else {
          reject(new Error('API Key cannot be empty.'));
        }
      });
    }
  });
};

export const clearChatHistory = (geminiClient) => {
  geminiClient.clearHistory();
  console.log(chalk.yellow(MESSAGES.HISTORY_CLEARED));
};

export const changeApiKey = async (rl) => {
  return new Promise((resolve, reject) => {
    rl.question('Enter new API Key: ', (newApiKey) => {
      if (newApiKey) {
        resolve(newApiKey);
      } else {
        reject(new Error('API Key cannot be empty.'));
      }
    });
  });
};
