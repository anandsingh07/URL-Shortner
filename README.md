# Z-SHORT: GenZ URL Shortener (Purple & White Dark Edition)

A high-performance URL shortening platform with a vibrant, modern UI.

## Tech Stack
- **Backend**: Node.js, TypeScript, Express, Prisma (PostgreSQL), Redis.
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Lucide Icons.
- **Infrastructure**: Docker, Docker Compose.

## How to Run

### 1. Start the Databases
In the root directory, run:
```bash
docker-compose up -d
```

### 2. Setup the Backend
```bash
cd backend
npm install
npx prisma db push
npm run dev
```

### 3. Setup the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Use the App
Open [http://localhost:3000](http://localhost:3000) in your browser.
Paste a long URL and get your glowing short link!
Redirects happen at [http://localhost:4000/:code](http://localhost:4000/:code).
