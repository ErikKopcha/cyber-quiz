# 🧠 Quiz-It: Senior Software Engineer Interview Trainer

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

> **Master the Senior Software Engineer interview.**
> A comprehensive, interactive quiz platform covering everything from Event Loop to System Design.

---

## 📸 Preview

_(Add screenshots of your Dashboard, Quiz, and Results screens here)_

---

## 🚀 Features

- **Deep Dives:** Questions curated from top-tier tech interviews (Google, Meta, Amazon).
- **Topic Coverage:**
  - ⚛️ **React Core & Advanced** (Fiber, Hooks, Concurrency)
  - 🚀 **Next.js & Performance** (SSR/SSG, RSC, Web Vitals)
  - ⚡ **JavaScript & TypeScript** (Closures, Event Loop, Generics)
  - 🏗 **System Design & Architecture** (Scalability, Security, Patterns)
- **Analytics:** Track your progress with detailed charts (powered by Recharts).
- **Gamification:** Earn quests and track your history.

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Styling:** [Sass (SCSS)](https://sass-lang.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Charts:** [Recharts](https://recharts.org/)
- **Validation:** [Zod](https://zod.dev/)
- **Backend/Auth:** [Firebase](https://firebase.google.com/)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn or pnpm

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/your-username/quiz-it.git
    cd quiz-it
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Setup Firebase**

    #### Create Firebase Project

    1. Go to [Firebase Console](https://console.firebase.google.com/)
    2. Click "Add project" and follow the setup wizard
    3. Once created, click on "Web" icon (</>) to add a web app
    4. Register your app and copy the Firebase configuration

    #### Enable Authentication

    1. In Firebase Console, go to **Authentication** > **Sign-in method**
    2. Enable **Google** sign-in provider
    3. Optionally enable **Email/Password** provider

    #### Create Firestore Database

    1. Go to **Firestore Database** > **Create database**
    2. Start in **production mode** (we'll deploy security rules later)
    3. Choose a database location closest to your users

    #### Deploy Security Rules

    ```bash
    # Install Firebase CLI
    npm install -g firebase-tools

    # Login to Firebase
    firebase login

    # Initialize Firebase (select Firestore)
    firebase init firestore

    # Deploy security rules
    firebase deploy --only firestore:rules
    ```

    #### Configure Environment Variables

    Create a `.env.local` file in the root directory:

    ```bash
    cp .env.local.example .env.local
    ```

    Fill in your Firebase credentials from the Firebase Console:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

### Directory Structure

```
src/
├── domain/               # Business logic & entities (framework-agnostic)
│   ├── entities/        # User, QuizSession, Question, Answer
│   └── repositories/    # Repository interfaces (IUserRepository, IQuizSessionRepository)
├── infrastructure/      # External dependencies implementation
│   ├── firebase/        # Firebase config & converters
│   └── repositories/    # Firestore repository implementations
└── presentation/        # UI layer (React/Next.js)
    ├── components/      # Reusable UI components
    ├── stores/          # Zustand state management
    └── styles/          # SCSS modules (ITCSS methodology)
```

### Key Design Patterns

- **Repository Pattern:** Abstraction layer for data access
- **Dependency Inversion:** Domain layer doesn't depend on infrastructure
- **Entity Pattern:** Business logic encapsulated in domain entities
- **State Management:** Zustand for global state (auth, quiz session)

### Firestore Collections

```
users/
  {userId}/
    - email, displayName, photoURL
    - level, xp, createdAt

quizSessions/
  {sessionId}/
    - userId, category, questionIds
    - answers[], totalScore, maxScore
    - startedAt, completedAt
```

## 📄 License

This project is licensed under the MIT License.
