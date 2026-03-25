# 🍲 SkillStew Client

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-v5-FF4154?logo=reactquery&logoColor=white)

The frontend client for **SkillStew**, a platform for discovering and attending live, expert-led workshops with a secondary peer-to-peer skill exchange feature.

This client interfaces with the [skill-stew-api](https://github.com/Faheem-T/skill-stew-api) backend, which powers the microservices architecture. This repository is built with a modern React stack and organized using feature-sliced design principles.

## Design System

The frontend design system lives in [docs/design-system.md](/home/faheem/Work/dev/brototype/skillStew/skill-stew-client/docs/design-system.md) and is the single source of truth for UI decisions.

- All colors must come from CSS variables defined in `src/index.css`
- The app ships with light and dark themes via a persisted theme preference
- Typography is constrained to `Playfair Display` for marketing display headings, `DM Sans` for UI/body copy, and `JetBrains Mono` for technical metadata
- UI must follow the three-zone model from the design system: Marketing, App Interior, and Live Streaming

## Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Radix UI Primitives + Lucide Icons + token-driven design system
- **State Management**:
  - Zustand (Global Application State)
  - TanStack React Query v5 (Data Fetching & Server State)
- **Forms & Validation**: React Hook Form + Zod
- **Routing**: React Router v7
- **Real-Time**: Socket.io-client

## Architecture & Directory Structure

The `src/` directory is organized around features rather than technical layers. This approach (Feature-Sliced Design) keeps related code grouped together.

```
src/
├── app/          # Global setups (Router configuration, global providers, layouts)
├── features/     # Feature modules (e.g., auth, user, onboarding, connections)
│   ├── api/      # Feature-specific api calls and React Query hooks
│   ├── components/ # Feature-specific UI components
│   ├── pages/    # Feature-specific route views
│   └── schemas.ts # Feature-specific Zod validation schemas
├── shared/       # Reusable components, hooks, utilities, and global API config
├── index.css     # Global Tailwind imports
└── main.tsx      # Application entry point
```

## Core Concepts & Patterns

### API Communication & Authentication

All external HTTP requests are handled by Axios instances configured in the `shared/api/` folder. Interceptors are heavily utilized to:

1. Automatically attach the JWT Access Token to outbound requests.
2. Automatically pause failing requests (401 Unauthorized), fetch a new Access Token using the `/refresh` endpoint, and retry the original request transparently.

### Form Handling

Forms universally follow a standard pattern:

- Defined by a **Zod Schema** (`schemas.ts`) that matches the backend DTO exactly.
- Managed by **React Hook Form**.
- Linked via `@hookform/resolvers/zod` (`zodResolver`) to provide strictly typed form states and automatic error surfacing before data is ever sent to the server.

### Data Fetching

**React Query** is used for all server state. This gives us out-of-the-box caching, background refetching, and drastically simplifies complex UI states (loading, error, success) while executing mutations across the `skill-stew-api` microservices.

### Real-Time Features

Real-time connection requests and notifications are pushed from the backend via WebSockets. The `socket.io-client` connects using the JWT access token and listens to the user's specific room channel.

## Setup & Development

### 1. Prerequisites

- Node.js (v20+ recommended)
- `npm` package manager

### 2. Installation

Install the project dependencies and configure the Git hooks (`husky`):

```bash
npm install
npm run prepare
```

### 3. Environment Variables

Create a `.env` file in the root of the project with the following required variables:

```env
VITE_GOOGLE_CLIENT_ID=example_id
VITE_WS_URL=http://stew.stew
VITE_MAPBOX_ACCESS_TOKEN=example_token
```

> **Note**: Variables prefixed with `VITE_` are automatically exposed to the frontend browser code by Vite.

### 4. Running Locally

Start the local development server (with HMR):

```bash
npm run dev
```

### 5. Building for Production

Type-check the TypeScript code and generate a static production bundle:

```bash
npm run build
```

## Code Quality

The repository strictly enforces code quality through automated tools:

- **ESLint & Prettier**: Used in conjunction to ensure clean, readable, and consistent code formatting.
- **Commitlint**: Husky hooks run `commitlint` to enforce the Conventional Commits specification (e.g., `feat:`, `fix:`, `chore:`) on every commit.
