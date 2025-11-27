# 🎾 Beach Tennis Championship

Sistema de agendamento para campeonato de beach tennis.

## 📁 Estrutura

```
booker/ (root)
├── frontend/          # Next.js + TypeScript + Tailwind
│   ├── src/
│   │   ├── app/       # Next.js app directory
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── README.md
│
└── backend/           # Express + TypeScript + Prisma
    ├── src/
    │   ├── index.ts   # Server entry
    │   ├── routes/
    │   ├── controllers/
    │   └── services/
    ├── prisma/
    │   └── schema.prisma
    ├── package.json
    ├── tsconfig.json
    └── README.md
```

## 🚀 Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesso: http://localhost:3000

### Backend

```bash
cd backend
npm install
npm run dev
```

Acesso: http://localhost:3000/health

## 📦 Tecnologias

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React 18

### Backend
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL

## 🔧 Scripts

### Frontend
- `npm run dev` - Dev server
- `npm run build` - Build production
- `npm start` - Start production
- `npm run lint` - ESLint check
- `npm run format` - Prettier format

### Backend
- `npm run dev` - Dev server (ts-node)
- `npm run build` - Build TypeScript
- `npm start` - Run production
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run migrations

## 📝 Próximos Passos

1. Configurar PostgreSQL
2. Implementar endpoints
3. Conectar frontend com backend
4. Adicionar autenticação
5. Testes

## 👥 Team

- Artur Figueiredo
- Douglas Machado Ribeiro
- Francine Gonçalves Franco
- Gabriela Dobbert Sanches
- Pedro Henrique Cavalcante