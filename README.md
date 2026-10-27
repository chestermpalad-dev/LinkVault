# LinkVault 🔖

**A modern, cloud-based bookmark management web application built with React, Tailwind CSS, and Supabase.**

LinkVault allows users to save, organize, search, and manage their favorite websites through a responsive dashboard. It includes secure user authentication, personalized bookmark collections, and cloud-based storage, allowing users to access their bookmarks across devices.

## 🌐 Live Demo

**Live Website:** [linkv4ult.vercel.app](https://linkv4ult.vercel.app/)

**GitHub Repository:** https://github.com/chestermpalad-dev/linkvault

## ✨ Features

### User Authentication
- User registration and login using Supabase Authentication
- Secure logout functionality
- Email verification support
- Private, user-specific bookmark management

### Bookmark Management
- Add, edit, and delete bookmarks
- Save website URLs, titles, and descriptions
- Organize bookmarks into collections
- Add and filter bookmarks using tags
- Mark frequently visited websites as favorites
- Search bookmarks instantly
- Sort bookmarks by name or date

### Dashboard and Interface
- Responsive dashboard for desktop and mobile devices
- Light and dark mode
- Bookmark statistics and collection overview
- Modern and user-friendly interface
- Public landing page with login and signup navigation

### Cloud Storage
- Store bookmarks in a cloud-hosted PostgreSQL database
- Access saved bookmarks across devices
- Persistent bookmark storage through Supabase
- Row Level Security (RLS) for user-specific data access

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| JavaScript | Application functionality |
| Vite | Development and production build tool |
| Tailwind CSS | Responsive styling |
| Lucide React | Icons |
| React Router | Client-side navigation |
| Supabase Authentication | User authentication and session management |
| Supabase PostgreSQL | Cloud database |
| Vercel | Web application deployment |
| Git & GitHub | Version control and source code hosting |

## 🚀 Installation and Setup

### Prerequisites

- Node.js and npm
- A Supabase account and project

### 1. Clone the Repository

`git clone https://github.com/chestermpalad-dev/linkvault.git`

### 2. Navigate to the Project Folder

`cd linkvault`

### 3. Install Dependencies

`npm install`

### 4. Configure Environment Variables

Create a `.env.local` file in the project root.

Add your Supabase project credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Replace the placeholder values with your actual Supabase project credentials.

**Important:** Never expose Supabase secret keys or service-role keys in frontend environment variables.

### 5. Configure Supabase Database

Create the required `bookmarks` table in your Supabase project and enable Row Level Security (RLS) with policies restricting access to each authenticated user's own bookmarks.

Enable Email Authentication in your Supabase project settings.

### 6. Start the Development Server

`npm run dev`

Open the local address displayed in your terminal, usually:

`http://localhost:5173`

## 🗄️ Database and Storage

LinkVault uses **Supabase PostgreSQL** to store user bookmarks, including their URLs, titles, descriptions, collections, tags, and favorite status.

User accounts and authentication sessions are managed through Supabase Authentication.

Each bookmark is associated with its owner, and Row Level Security policies enforce user-specific database access.

The application uses browser LocalStorage for interface preferences, such as the selected theme, and supports importing bookmarks from its earlier browser-storage version.

## 🔐 Security

- Supabase Authentication for user login and registration
- Protected dashboard routes
- User-specific database access using Row Level Security
- Session management through Supabase
- Environment-based Supabase project configuration

## ☁️ Deployment

LinkVault is deployed using **Vercel** and connected to a cloud-hosted Supabase project.

The website supports automatic deployments when changes are pushed to the production branch on GitHub.

## 👨‍💻 Developer

**Chester Mikhail Palad**

Software Developer | Full-Stack Web Development

**GitHub:** https://github.com/chestermpalad-dev

## 📄 Project Purpose

LinkVault is a personal web development portfolio project demonstrating frontend development, cloud database integration, user authentication, CRUD operations, responsive design, and web application deployment.
