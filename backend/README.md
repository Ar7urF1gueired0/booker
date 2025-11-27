# Beach Tennis Backend

Express.js + TypeScript + Prisma

## Setup

```bash
npm install
npm run dev
```

Acesso: http://localhost:3000/health

## 📁 Estrutura

```
backend/
├── src/
│   ├── index.ts           # Server entry point
│   ├── routes/            # API routes
│   ├── controllers/       # Request handlers
│   └── services/          # Business logic
├── prisma/
│   └── schema.prisma      # Database schema
├── package.json
├── tsconfig.json
└── .env.example
```

## Scripts

- `npm run dev` - Dev server (ts-node)
- `npm run build` - Build TypeScript
- `npm start` - Run production
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run migrations

## Endpoints

- `GET /health` - Health check
- `GET /api/tournaments` - List tournaments
- `POST /api/tournaments` - Create tournament
- `GET /api/tournaments/:id` - Get tournament
