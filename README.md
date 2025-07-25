# LWMHR ChatBot CLI

A Node.js CLI chatbot tool for Termux that allows you to interact with the Google Gemini API.

## Features

-   **Enhanced ASCII Banner:** A full-width, colorful ASCII banner with subtitle and description.
-   **API Key Management:** Prompts for Gemini API Key on first use and stores it securely in a `.env` file. Each user provides their own key.
-   **Interactive Chat:** Provides an interactive command-line interface for chatting with Gemini.
-   **Chat History:** Maintains chat history for context-aware conversations.
-   **Styled Output:** Uses `chalk` and `boxen` for a visually appealing interface, including bordered Gemini responses.
-   **Typing Indicator:** Displays a "Gemini is typing..." message while waiting for a response.

## Prerequisites

-   [Node.js](https://nodejs.org/en/) (v14 or higher)
-   [Termux](https://termux.com/) (for Android users)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/mhrtuch240/lwmhrChatBot-cli.git
    cd lwmhrChatBot-cli
    ```
    ***Update to new version:***

    ```bash
    git fetch --tags
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Make it globally accessible (optional but recommended):**

    ```bash
    npm link
    ```
    This command creates a symbolic link so you can run `lwmhr` from any directory.

5.  **Set up your API Key:**

    The first time you run the application, you will be prompted to enter your Gemini API Key. It will be saved in a `.env` file for future use.

## Usage

To start the chatbot, if you used `npm link`:

```bash
lwmhr
```

Otherwise, navigate to the project directory and run:

```bash
node index.js
```

### Commands

-   `exit`: Exit the chat.
-   `--help` or `help`: Show usage instructions, including contact and info.
-   `/clear`: Clear the chat history.
-   `/apikey`: Change your Gemini API Key.

## How it Works

The tool uses the following packages:

-   `chalk` and `gradient-string`: For styling the output.
-   `dotenv`: To manage the Gemini API Key.
-   `readline`: For the interactive CLI.
-   `axios`: To make requests to the Gemini API.
-   `boxen`: To create styled boxes in the terminal.
