# Jira Clone (This project is for education only)

A **Jira-like project management application** built with a modern tech stack.

This project replicates core features of Jira: workspaces, projects, tasks, and workflows. It is designed with scalability, modularity, and production-readiness in mind.

![jira-clone](https://socialify.git.ci/vanphatit/jira-clone/image?custom_description=&description=1&issues=1&language=1&name=1&owner=1&pulls=1&stargazers=1&theme=Light)
---

## 🛠️ Tech Stack

### Frontend

* **Next.js**
* **TypeScript**
* **TailwindCSS**
* **Redux Toolkit** for state management
* **React Hook Form + Zod** for form handling & validation
* **React Query** for API data fetching and caching
* **Lucide-React**, **React Icons** for UI icons
* **Shadcn UI** (Radix UI based component library)

### Backend

* **Express.js** (TypeScript)
* **MongoDB** with **Mongoose**
* **Redis** for caching
* **JWT Authentication** (Access Token + Refresh Token system)
* **Google OAuth2** and **GitHub OAuth** integration
* **Resend** (Email service)

### DevOps

* **Docker** (multi-stage builds)
* **Docker Compose** for local development
---

## ⚙️ Features

* 🛠️ **Workspace & Project Management**: Create workspaces, manage projects within workspaces.
* 🧩 **Task Management**: Tasks with statuses (Backlog, In Progress, Done) and drag-drop reordering.
* 🔐 **Authentication**:

  * Email/password signup/login
  * Google and GitHub OAuth2
* ✅ **Form Validation**: With Zod schemas and React Hook Form.
* 🗂️ **File Upload**: Upload assets for tasks or project settings.
* 📚 **API Layer**: Typed RESTful APIs with request/response validation.
* ⚡ **Optimistic UI**: Using React Query for fast interactions.
* 📨 **Email Verification**: Via Resend API.
* 🐳 **Dockerized**: Docker + Docker Compose setup for both frontend and backend.

---

## 📁 Folder Structure

```
/frontend
├── components        # Reusable UI components
├── pages             # Next.js Pages (Routing)
├── hooks             # Custom React Hooks (useAuth, useProject etc.)
├── lib               # Utility functions, API clients
├── stores            # Redux slices
├── schemas           # Zod validation schemas
├── public/assets     # Static files
├── Dockerfile
└── .env.local
/backend
├── src
│   ├── controllers    # Route handlers
│   ├── services       # Business logic
│   ├── repositories   # DB interaction (Mongoose models)
│   ├── middlewares    # Express middlewares (auth, error handling)
│   ├── routes         # API route definitions
│   ├── utils          # Utility functions (token generation, email sending)
│   ├── config         # Configurations (DB, Redis, OAuth)
│   ├── app.ts         # Express app setup
│   └── server.ts      # App entry point
├── Dockerfile
└── .env.local
docker-compose.yml
```

---

## 🧩 Environment Variables

You need to configure the following environment variables:

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

### Backend (`.env`)

```env
PORT=3001
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

MONGO_URI=your_mongo_uri
REDIS_URL=redis://redis:6379

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

RESEND_API_KEY=your_resend_api_key
RESEND_FROM=your_domain

CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:3001
COOKIE_DOMAIN=localhost
```

---

## 🐳 Docker Setup

### 1. Build and Run

```bash
docker-compose up --build
```

It will:

* Spin up MongoDB
* Spin up Redis
* Start backend (Express.js)
* Start frontend (Next.js)

### 2. Access the app

* Frontend: `http://localhost:3000`
* Backend API: `http://localhost:3001/api`

---

## 🚀 API Overview

* `POST /api/auth/register` — User registration
* `POST /api/auth/login` — User login
* `POST /api/auth/oauth/google` — Google OAuth login
* `POST /api/auth/oauth/github` — GitHub OAuth login
* `POST /api/workspaces` — Create workspace
* `GET /api/workspaces` — List user’s workspaces
* `POST /api/projects` — Create project in workspace
* `PATCH /api/tasks/:id` — Update task
* ...

Fully typed request & response with validation.

---

## 🛡️ Security

* Secure JWT handling with access & refresh tokens
* HttpOnly cookie storage for refresh tokens
* OAuth 2.0 login flows (Google, GitHub)
* Rate limiting and validation on all endpoints

---

## 🧑‍💻 Author

**Văn Phát**
GitHub: [@vanphatit](https://github.com/vanphatit)
