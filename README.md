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

Update the Firebase configuration in `src/utils/firebase-init.tsx` with your own project credentials from the Firebase Console.

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
