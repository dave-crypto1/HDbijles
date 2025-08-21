# Overview

HD Bijles is a tutoring service booking application that allows students to book tutoring sessions for physics, mathematics, and other subjects. The application provides a bilingual (Dutch/English with Arabic and French support) interface for students to view available time slots, book sessions, and receive email confirmations. It includes an admin panel for managing form settings, availability schedules, and viewing bookings.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React 18 with TypeScript in a single-page application (SPA) architecture. Key design decisions include:

- **Component Library**: Uses shadcn/ui components built on top of Radix UI primitives for consistent, accessible UI components
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting both light and dark modes
- **State Management**: React Query (@tanstack/react-query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Internationalization**: Custom translation system supporting Dutch, English, French, and Arabic languages

## Backend Architecture
The backend follows a RESTful API design using Express.js with TypeScript:

- **API Design**: RESTful endpoints for bookings, form settings, and availability management
- **Data Validation**: Zod schemas for runtime type checking and validation
- **Storage Pattern**: Interface-based storage layer (IStorage) with in-memory implementation for development
- **Email Integration**: Nodemailer for sending booking confirmation emails
- **Error Handling**: Centralized error handling middleware with structured error responses

## Data Storage Solutions
The application uses a dual storage approach:

- **Development**: In-memory storage implementation for rapid development and testing
- **Production Ready**: Drizzle ORM with PostgreSQL schema definitions prepared for database integration
- **Schema Design**: Well-defined TypeScript types and Zod schemas for data consistency across the application

## Authentication and Authorization
The admin panel includes a basic authentication system:

- **Admin Access**: Username/password authentication for administrative functions
- **Session Management**: Express session handling for maintaining authentication state
- **Route Protection**: Client-side route protection for admin-only features

## Key Features
- **Booking System**: Students can select time slots, subjects, and submit booking requests
- **Admin Panel**: Administrative interface for managing settings, availability, and viewing bookings
- **Email Notifications**: Automatic email confirmations sent to the configured contact email
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS
- **Theme Support**: Light/dark theme toggle with system preference detection
- **Multi-language Support**: Built-in internationalization for multiple languages

# External Dependencies

## Core Framework Dependencies
- **React 18**: Frontend framework with hooks and modern React patterns
- **Express.js**: Backend web framework for Node.js
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Frontend build tool and development server

## Database and ORM
- **Drizzle ORM**: Type-safe database access layer
- **@neondatabase/serverless**: PostgreSQL database driver
- **connect-pg-simple**: PostgreSQL session store for Express

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library

## Form and Validation
- **React Hook Form**: Form state management
- **Zod**: Schema validation library
- **@hookform/resolvers**: Zod integration for React Hook Form

## State Management and API
- **@tanstack/react-query**: Server state management and caching
- **Wouter**: Lightweight React router

## Email Service
- **Nodemailer**: Email sending functionality for booking confirmations

## Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling
- **tsx**: TypeScript execution for development server
- **esbuild**: Fast JavaScript bundler for production builds

## Additional Utilities
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional CSS class management
- **class-variance-authority**: Component variant management
- **nanoid**: Unique ID generation