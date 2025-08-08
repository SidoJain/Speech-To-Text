# Speech to Text App

A modern React app that enables users to convert spoken words to text, supporting multiple languages and offering useful transcript utilities like copy and download.

## Features

- 🎤 **Real-time Speech Recognition:** Start/stop microphone recording and see your speech appear as text instantly.
- 🌐 **Multi-language Support:** Choose from 20+ popular languages for transcription.
- ⚡ **Copy & Download Utilities:** Easily copy the transcript to clipboard or download it as a text file.
- 🎚️ **Confidence Indicator:** View speech recognition confidence.
- 🧹 **Transcript Management:** Clear the transcript with a single click.
- ⚠️ **Browser Compatibility Check:** Gracefully handles unsupported browsers, with guidance for users.
- ✨ **Clean UI:** Responsive design and intuitive controls using ShadCN and Lucide Icons.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm or npm
- SpeechRecognition API is supported only on select browsers (Chrome, Edge, Safari).

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/SidoJain/Speech-To-Text.git
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the development server:**

    ```bash
    npm run dev
    ```

## Usage

1. **Select a Language:** Choose your preferred language for speech recognition.
2. **Start Recording:** Allow microphone access when prompted and begin speaking clearly.
3. **View Transcript:** Your spoken words will appear as text in real time.
4. **Stop Recording:** Click the stop button when done.
5. **Copy/Download Transcript:** Use the respective buttons to save your transcript.

> **Note:**  
> If you see a browser not supported message, please switch to Chrome, Edge, or Safari.

## Customization

- Add or remove languages by editing the `SUPPORTED_LANGUAGES` array.
- Style the app using Tailwind CSS classes or customize ShadCN components.

## Tech Stack

- React
- TypeScript
- ShadCN UI
- Lucide Icons
- SpeechRecognition API

## Limitations

- **Speech API Support:** Web SpeechRecognition API is not available in all browsers.
- **Mobile:** Some mobile browsers may not support the API.
- **Accuracy:** Speech recognition accuracy depends on browser and microphone quality.

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).