# Vite React Redux Firebase Template

A clean boilerplate for building React applications with Vite, Redux Toolkit, and Firebase.

## Features

- **Vite**: Ultra-fast frontend tooling
- **React**: Modern component-based UI
- **Redux Toolkit**: Efficient state management
- **Firebase**: Backend-as-a-Service (Auth, Database)
- **Tailwind CSS**: Utility-first styling
- **TypeScript**: Static typing for better developer experience
- **Vitest**: Blazing fast unit testing
- **Storybook**: Component documentation and isolation

## Getting Started

To create a new project using this template, follow these steps:

### 1. Initialize the project

You can use `degit` to clone the template without the git history:

```bash
npx degit afrievalt/vite-template my-new-project
cd my-new-project
```

Or simply clone the repository:

```bash
git clone https://github.com/afrievalt/vite-template.git my-new-project
cd my-new-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

#### a) Set up environment variables

Create a `.env` file in the project root (you can copy `.env.example` as a starting point):

```bash
cp .env.example .env
```

Then update the `.env` file with your own Firebase project credentials from the Firebase Console:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_DATABASE_URL=your_database_url_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

**Note**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

#### b) Set up Firebase CLI configuration

Create a `.firebaserc` file (you can copy `.firebaserc.example` as a starting point):

```bash
cp .firebaserc.example .firebaserc
```

Then update it with your Firebase project ID:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

### 4. Start developing

```bash
npm run dev
```

## Project Structure

The project follows a component-driven architecture where folders mirror the JSX structure:

```text
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── store/          # Redux Toolkit slices and store configuration
├── utils/          # Utility functions and initializations (Firebase, etc.)
├── Views/          # Page components, structured by route
└── ...
```

### Path Aliases

The template uses path aliases for cleaner imports (configured in `tsconfig.app.json`):

- `@components/*` points to `src/components/*`
- `@hooks/*` points to `src/hooks/*`
- `@store/*` points to `src/store/*`

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run test`: Run unit tests
- `npm run lint`: Run linter
- `npm run storybook`: Start Storybook

---

---
