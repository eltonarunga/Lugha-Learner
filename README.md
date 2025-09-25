# Lugha Learner

![Lugha Learner](https://storage.googleapis.com/aai-web-samples/apps/language-learner.png)

Lugha Learner is a fun, Duolingo-style language learning application designed to help users learn various Kenyan languages, including Swahili, Luo, Kikuyu, and Kalenjin. The app provides an interactive and engaging experience through structured lessons, diverse quizzes, and gamified progress tracking.

The application is enhanced with AI-powered features using the Google Gemini API to offer dynamic content and personalized learning experiences.

## ✨ Features

-   **Multi-Language Support**: Learn Swahili, Luo, Kikuyu, and Kalenjin.
-   **Structured Curriculum**: Progress through levels from Beginner to Intermediate, each containing multiple lessons.
-   **Interactive Quizzes**: Test your knowledge with various question formats, including Multiple Choice and Fill-in-the-Blank.
-   **Gamified Learning**: Earn XP for completing lessons, build up a daily streak, and track your progress.
-   **Persistent Progress**: Your learning journey is automatically saved in your browser, allowing you to pick up where you left off.
-   **AI-Powered Tools**:
    -   **📚 Epic Adventure Mode**: Generates unique, interactive stories based on lesson themes to test comprehension in a fun new way.
    -   **🏞️ Adventure Mode**: Upload a photo of a character and have the AI create a personalized story set in Kenya, incorporating vocabulary from your chosen language.
    -   **📸 Visual Vocabulary**: Use your device's camera or upload a photo to identify objects and learn their names in your target language.
    -   **💬 Conversation Tutor**: Practice your conversational skills by chatting with a friendly AI tutor that provides gentle corrections and guidance.
-   **Leaderboard**: Compete with other learners and see how your XP stacks up.
-   **Daily Goals**: Set personal daily goals to stay motivated and consistent with your learning.
-   **Dictionary**: A handy in-app dictionary for each language to look up words and their meanings.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI**: [Google Gemini API](https://ai.google.dev/)
-   **State Management**: React Context API with Hooks
-   **Persistence**: Browser Local Storage

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/lugha-learner.git
    cd lugha-learner
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up Environment Variables:**
    This application requires a Google Gemini API key to power its AI features. You must configure this key as an environment variable.

    Create a `.env` file in the root of your project and add your API key:
    ```
    API_KEY=your_google_gemini_api_key_here
    ```

    *Note: The application is designed to source the API key from `process.env.API_KEY` as per deployment best practices.*

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) (or the port specified in your terminal) to view it in the browser.

## 📂 Project Structure

```
/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable React components
│   ├── hooks/            # Custom React hooks (e.g., useLugha for state)
│   ├── lib/              # Shared libraries/utilities (e.g., Gemini client)
│   ├── App.tsx           # Main application component
│   ├── constants.ts      # Static data (languages, lessons, etc.)
│   ├── index.tsx         # Entry point for React
│   └── types.ts          # TypeScript type definitions
├── .env                  # Environment variables (API Key)
├── index.html            # Main HTML file
└── README.md             # This file
```

## 🔒 Security Considerations

-   **API Key Management**: The Google Gemini API key is accessed securely via environment variables and is not exposed on the client-side. The application includes robust checks to ensure the key is present before making API calls.
-   **Frontend Dependencies**: The application uses scripts from CDNs. For a production environment, it is recommended to implement [Subresource Integrity (SRI)](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) to ensure the fetched resources have not been tampered with.

## 🌱 Future Improvements

-   [ ] Implement a full serverless backend (e.g., Firebase) for user authentication and database storage.
-   [ ] Add more languages and expand the lesson content for existing ones.
-   [ ] Introduce audio for pronunciation practice.
-   [ ] Create more advanced lesson types focusing on grammar and sentence structure.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
