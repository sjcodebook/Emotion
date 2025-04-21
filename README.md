# Emotion: A Notion Clone

A powerful and feature-rich document management and productivity application inspired by Notion, built with modern web technologies.

## Features

### Document Management
- **Rich Text Editor**: BlockNote-powered editor with support for multiple content types
- **Kanban Board**: Drag-and-drop kanban boards for visual task management
- **File Management**: Organize documents in a hierarchical structure
- **Real-time Updates**: Changes reflect instantly across all users

### User Experience
- **Dark/Light Mode**: Toggle between visual themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Command Palette**: Quick actions with keyboard shortcuts (⌘K)
- **Cover Images**: Customize documents with beautiful cover images
- **Custom Icons**: Personalize documents with a wide selection of icons

### Organization
- **Document Archive**: Store less frequently used documents
- **Trash Bin**: Recover accidentally deleted documents
- **Search**: Powerful full-text search across all documents
- **Publishing**: Share documents publicly with a unique URL

### User Management
- **Authentication**: Secure login and registration system
- **User Profiles**: Personalized user experience
- **Settings Management**: Customize application settings

## Technology Stack

### Frontend
- **Next.js 14**: App Router for efficient page rendering and routing
- **React**: Component-based UI architecture
- **TypeScript**: Type-safe code for better developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn UI**: High-quality, accessible UI components
- **BlockNote Editor**: Powerful rich text editing experience
- **Lucide Icons**: Beautiful, consistent iconography

### Backend
- **NextAuth.js**: Authentication with multiple providers
- **Prisma ORM**: Type-safe database access
- **PostgreSQL**: Robust relational database
- **Server Actions**: Modern approach for server-side logic
- **TanStack Query**: Data fetching and caching
- **Zod**: Schema validation

### Services
- **Stripe**: Payment processing integration
- **Image Upload**: Seamless image upload and management

### DevOps
- **Docker**: Containerization for consistent environments
- **TypeScript**: Strong typing for better code quality

## Architecture

The application follows a clean architecture design with:

- **Data Access Layer**: Abstracts database operations
- **Use Cases**: Business logic isolated from UI
- **Components**: Reusable UI building blocks
- **Providers**: Context providers for global state
- **Hooks**: Custom React hooks for shared functionality
- **Server Actions**: Backend logic with type safety

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/notion-clone.git
cd notion-clone
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your database and auth settings
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

✌️