import axios from 'axios';
import chalk from 'chalk';
import boxen from 'boxen';

export class GeminiChatClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.chatHistory = [];
  }

  async sendMessage(message) {
    try {
      const userMessage = { role: 'user', parts: [{ text: message }] };
      const contents = [...this.chatHistory, userMessage];

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          contents: contents,
        }
      );

      if (response.data.candidates && response.data.candidates.length > 0 && response.data.candidates[0].content.parts) {
        const geminiContent = response.data.candidates[0].content;
        const text = geminiContent.parts[0].text;

        this.chatHistory.push(userMessage);
        this.chatHistory.push(geminiContent);

        return { success: true, response: text };
      } else {
        return { success: false, error: 'Received an empty response from Gemini.' };
      }

    } catch (error) {
      let errorMessage = error.message;
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = `[${error.response.status}] ${error.response.data.error.message}`;
      }
      return { success: false, error: `Error communicating with Gemini API: ${errorMessage}` };
    }
  }

  getChatHistory() {
    return this.chatHistory;
  }

  clearHistory() {
    this.chatHistory = [];
  }

  updateApiKey(newApiKey) {
    this.apiKey = newApiKey;
  }
}
