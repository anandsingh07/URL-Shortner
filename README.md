# Z-SHORT: High-Performance URL Shortener

Z-SHORT is a modern, full-stack URL shortening application designed for speed, scalability, and a premium user experience. It leverages a dual-layer storage strategy using PostgreSQL for persistence and Redis for sub-millisecond redirect performance.

## Live Demo
The application is deployed and can be accessed at:
https://url-shortner-topaz.vercel.app/

## Core Features
- Custom Alias Support: Users can define personalized short links.
- High-Speed Redirects: Frequently accessed links are served directly from a Redis cache.
- Modern UI: A responsive, high-fidelity interface built with Next.js and Framer Motion.
- Persistence: Reliable data storage using PostgreSQL and Prisma ORM.
- Containerized: Ready for local development using Docker Compose.

## Technology Stack

### Frontend
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Animations: Framer Motion
- Icons: Lucide React

### Backend
- Runtime: Node.js (TypeScript)
- Framework: Express.js
- Database ORM: Prisma
- Cache: Redis (via ioredis)

### Infrastructure
- Database: PostgreSQL (Neon)
- Serverless Cache: Upstash Redis
- Hosting: Vercel (Frontend), Render (Backend)

## Architecture Overview
The system employs a write-around caching strategy. When a URL is shortened, it is simultaneously stored in PostgreSQL and cached in Redis. During a redirect request, the system first checks the Redis cache. If the link is found, the user is redirected immediately. If not found in cache, the system queries PostgreSQL, performs a redirect, and back-fills the cache for subsequent requests.

## Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose

### Steps
1. Clone the repository.
2. Configure environment variables:
   - Create a `.env` file in the `backend` directory based on the provided template.
   - Create a `.env.local` file in the `frontend` directory.
3. Start the infrastructure using Docker:
   ```bash
   docker-compose up -d
   ```
4. Install dependencies and start the backend:
   ```bash
   cd backend
   npm install
   npx prisma db push
   npm run dev
   ```
5. Install dependencies and start the frontend:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## Production Deployment

### Backend
The backend should be deployed to a platform supporting Node.js (e.g., Render, Railway). Ensure the `DATABASE_URL`, `REDIS_URL`, and `BASE_URL` environment variables are correctly configured.

### Frontend
The frontend is optimized for deployment on Vercel. Set the `NEXT_PUBLIC_API_URL` to point to your deployed backend instance.

## License
This project is licensed under the MIT License.
