# Multi-Workspace Task Board

A scalable, production-ready SaaS frontend application built with React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, and TanStack React Query.

## Features
- **Multi-Workspace System**: Switch between different workspaces dynamically.
- **Kanban Board**: Drag and drop tasks between columns and reorder them within a column using `@dnd-kit`.
- **Authentication**: JWT mock authentication using Mock Service Worker (MSW).
- **Activity Feed**: Real-time polling activity feed showing recent actions.
- **Public Shareable Pages**: Read-only board URLs optimized for SEO with dynamic meta tags.

## Tech Stack
- React 19 + Vite + TypeScript
- TanStack React Query (Server State)
- Zustand (Client State)
- Tailwind CSS v4 + Shadcn UI components
- @dnd-kit (Drag and Drop)
- React Hook Form + Zod
- Mock Service Worker (MSW)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Login Credentials**
   The application intercepts API calls via MSW. Use these credentials to login:
   - Email: `demo@test.com`
   - Password: `password123`

## Architecture Notes
Please refer to `ENGINEERING_NOTES.md` for a comprehensive breakdown of architectural decisions, folder structure explanations, and data flow diagrams.
