#!/usr/bin/env node
import chalk from 'chalk';
import readline from 'readline';
import dotenv from 'dotenv';
import boxen from 'boxen';
import { GeminiChatClient } from './src/geminiChat.js';
import { displayBanner, getApiKey, clearChatHistory, changeApiKey } from './src/utils.js';
import { MESSAGES, PROMPTS, COMMANDS, HELP_CONTENT } from './src/constants.js';
import wrapAnsi from 'wrap-ansi';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const startChat = async () => {
  displayBanner();
  let apiKey;
  try {
    apiKey = await getApiKey(rl);
  } catch (error) {
    console.error(chalk.red(`Error getting API key: ${error.message}`));
    rl.close();
    return;
  }

  const geminiClient = new GeminiChatClient(apiKey);

  console.log(chalk.blue(MESSAGES.CHAT_START));

  rl.setPrompt(chalk.white(PROMPTS.USER_INPUT)); // Set the actual readline prompt
  rl.prompt();

  rl.on('line', async (input) => {
    const command = input.toLowerCase().trim();

    switch (command) {
      case COMMANDS.EXIT:
        rl.close();
        return;
      case COMMANDS.HELP:
        console.log(chalk.yellow('Commands:'));
        console.log(chalk.yellow(`  ${COMMANDS.EXIT}          - Exit the chat`));
        console.log(chalk.yellow(`  ${COMMANDS.HELP}         - Show this help message`));
        console.log(chalk.yellow(`  ${COMMANDS.CLEAR_HISTORY}  - Clear chat history`));
        console.log(chalk.yellow(`  ${COMMANDS.CHANGE_API_KEY} - Change Gemini API Key`));
        console.log(''); // Add an empty line
        console.log(chalk.yellow('Contact & Info:'));
        console.log(chalk.yellow(`  Email 1: ${HELP_CONTENT.EMAIL_1}`));
        console.log(chalk.yellow(`  Email 2: ${HELP_CONTENT.EMAIL_2}`));
        console.log(chalk.yellow(`  GitHub:  github.com/${HELP_CONTENT.GITHUB_USERNAME}`));
        console.log(chalk.yellow(`  More Info: ${HELP_CONTENT.MORE_INFO}`));
        break;
      case COMMANDS.CLEAR_HISTORY:
        clearChatHistory(geminiClient);
        break;
      case COMMANDS.CHANGE_API_KEY:
        try {
          apiKey = await changeApiKey(rl);
          geminiClient.updateApiKey(apiKey);
        } catch (error) {
          console.error(chalk.red(`Error changing API key: ${error.message}`));
        }
        break;
      default:
        // Typing effect
        process.stdout.write(chalk.yellow(MESSAGES.TYPING_INDICATOR));
        readline.cursorTo(process.stdout, 0);

        const response = await geminiClient.sendMessage(input);

        readline.clearLine(process.stdout, 0); // Clear the typing indicator line

        if (response.success) {
          console.log(boxen(chalk.green('Gemini:') + ' ' + response.response, { padding: 1, margin: 1, borderStyle: 'round', borderColor: 'blue', width: 120 }));
        } else {
          console.error(chalk.red(response.error));
        }
        break;
    }
    rl.prompt();
  });

  rl.on('SIGINT', () => {
    rl.close();
  });

  rl.on('close', () => {
    console.log(chalk.blue('Exiting chat. Goodbye!'));
    process.exit(0);
  });
};

startChat();
