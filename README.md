# 🎾 Beach Tennis Championship - Booker

**Sistema completo e integrado para gerenciamento de campeonatos de beach tennis**

Plataforma web moderna que centraliza todo o ciclo de vida de um campeonato: desde a autenticação de usuários, passando pelo registro em torneios, agendamento de partidas, até a gestão de arenas e conquistas. Desenvolvida com arquitetura moderna (Frontend Next.js + Backend Express) e banco de dados relacional.

---

## 📖 Índice

1. [Resumo Executivo](#resumo-executivo)
2. [Funcionalidades Principais](#-funcionalidades-principais)
3. [Tecnologias](#-tecnologias)
4. [Pré-requisitos](#-pré-requisitos)
5. [Instalação Rápida](#-instalação-rápida)
6. [Arquitetura da Aplicação](#-arquitetura-da-aplicação)
7. [Estrutura do Projeto](#-estrutura-do-projeto)
8. [Detalhamento das Features](#-detalhamento-das-features)
9. [API Endpoints Completos](#-api-endpoints-completos)
10. [Banco de Dados](#-banco-de-dados)
11. [Scripts e Comandos](#-scripts-e-comandos)
12. [Testes](#-testes)
13. [Deployment](#-deployment)
14. [Contribuindo](#-contribuindo)

---

## Resumo Executivo

O **Booker** é um sistema SaaS (Software as a Service) que resolve os principais desafios na organização de campeonatos de beach tennis:

| Aspecto | Solução |
|--------|---------|
| **Gestão de Participantes** | Cadastro completo com dados técnicos (nível, tipo de mão, backhand) |
| **Organização de Torneios** | Criação, gerenciamento de datas, filtro por nível e categoria |
| **Agendamento Automático** | Interface intuitiva para agendar partidas em arenas específicas |
| **Feed Social** | Comunidade integrada para compartilhar momentos |
| **Controle de Acesso** | Sistema de roles (USER/ADMIN) com autenticação JWT segura |

---

## ✨ Funcionalidades Principais

### 🔐 **Autenticação & Autorização**
- Registro de novos usuários com validação de email
- Login seguro com JWT (JSON Web Tokens)
- Criptografia de senha com bcryptjs
- Autenticação persistente entre sessões
- Proteção de rotas (públicas vs. autenticadas)
- Sistema de roles: USER e ADMIN

### 👤 **Gerenciamento de Perfil**
- Cadastro completo com dados pessoais (nome, email, data de nascimento)
- Informações técnicas de beach tennis:
  - **Nível de jogo**: PRO, A, B, C
  - **Tipo de mão dominante**: RIGHT, LEFT
  - **Tipo de backhand**: ONE_HAND, TWO_HANDS
  - **Gênero**: MALE, FEMALE, OTHER
- Foto de perfil e capa personalizadas
- Histórico de conquistas (achievements)
- Visualização de estatísticas pessoais

### 🏆 **Gerenciamento de Torneios**
- **Criar torneios** (acesso restrito para admins)
  - Nome do torneio
  - Datas de início e término
  - Prazo para inscrição
  - Filtro por categoria/nível
  - Arena associada
  - Status: OPEN, ONGOING, FINISHED, CANCELED, SCHEDULED
- **Listar torneios**
- **Registrar em torneios**

### 📅 **Agendamento de Partidas**
- Visualização de agenda completa
- Criação de partidas associadas a torneios e arenas
- Rastreamento de status das partidas:
  - **SCHEDULED**: Agendada
  - **ONGOING**: Em andamento
  - **FINISHED**: Finalizada
  - **CANCELED**: Cancelada
- Registro de placar (scoreResult)
- Definição de times (teamNumber 1 ou 2)
- Registro de vencedor

### 🏖️ **Gerenciamento de Arenas**
- Cadastro de locais de jogo
- Informações da arena:
  - Nome do local
  - Endereço completo
  - Cidade
  - Telefone para contato
- Associação de partidas a arenas
- Visualização de disponibilidade

### 👥 **Sistema de Participação**
- **Duplas**: Suporte nativo para jogadores em pares
- **Participantes de Partida**: Rastreamento de quem jogou
- **Histórico**: Visualização completa de quem participou de cada evento
- **Registros Únicos**: Validação para evitar duplicação (um usuário + um torneio = único)

### 📱 **Feed Social**
- Publicação de posts (texto + imagem)
- Visualização de feed com todos os posts

---

## 🛠️ Tecnologias

### **Frontend** (Next.js + TypeScript)
| Tecnologia | Propósito |
|-----------|----------|
| **Next.js 14** | Framework React moderno com SSR/SSG, otimização automática |
| **TypeScript** | Tipagem estática para segurança em desenvolvimento |
| **Tailwind CSS** | Estilização utility-first responsiva |
| **React Context API** | Gerenciamento de estado (autenticação) |
| **Vitest + jsdom** | Testes unitários rápidos com suporte a DOM |
| **Next.js App Router** | Roteamento moderno com suporte a layouts aninhados |

### **Backend** (Express + TypeScript)
| Tecnologia | Propósito |
|-----------|----------|
| **Express.js** | Framework web minimalista e poderoso |
| **TypeScript** | Tipagem estática para APIs robustas |
| **Prisma ORM** | Acesso ao banco de dados type-safe com schema declarativo |
| **PostgreSQL** | Banco de dados relacional confiável |
| **JWT (jsonwebtoken)** | Autenticação stateless e segura |
| **bcryptjs** | Hash irreversível de senhas |
| **Zod** | Validação de schemas em runtime |
| **CORS** | Compartilhamento de recursos entre domínios |
| **dotenv** | Gerenciamento de variáveis de ambiente |

### **DevOps & Infraestrutura**
| Tecnologia | Propósito |
|-----------|----------|
| **PostgreSQL (Trailway)** | Banco de dados |
| **npm/Node.js** | Gerenciamento de dependências e runtime |
| **Vercel/Render** | Deploy do frontend e backend respectivamente|

---

## 📋 Pré-requisitos

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm**
- **Git** ([Download](https://git-scm.com/))

## 🚀 Instalação Rápida

### Pré-requisitos Verificar
```bash
# Node.js v18+
node --version

# npm
npm --version

```

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/Ar7urF1gueired0/booker.git
cd booker
```

### Passo 2: Instalar Dependências
```bash
# Instala dependências em: root, backend e frontend
npm run install:all
```

### Passo 3: Configurar Variáveis de Ambiente

**Arquivo `backend/.env`:**
```env
# ===== DATABASE =====
POSTGRES_USER=booker
POSTGRES_PASSWORD=booker
POSTGRES_DB=booker
POSTGRES_PORT=5440
DATABASE_URL="postgresql://booker:booker@localhost:5440/booker?schema=public"

# ===== AUTHENTICATION =====
JWT_SECRET=secret
```

**Arquivo `frontend/.env.local`:**
```env
# URL da API backend (sem barra final)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Passo 4: Iniciar PostgreSQL
```bash
cd backend
docker-compose up -d
```

Verificar se subiu:
```bash
docker ps | grep booker-db
```

### Passo 5: Preparar Banco de Dados
```bash
cd backend

# Gerar cliente Prisma
npm run prisma:generate

# Executar migrations (criar tabelas)
npm run prisma:migrate
```

Opcional - Preencher com dados de teste:
```bash
npx prisma db seed
```

### Passo 6: Iniciar a Aplicação

**Terminal 1 - Backend (Express na porta 3000):**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend (Next.js na porta 3000 ou 3001):**
```bash
cd frontend
npm run dev
```

### 🎉 Pronto!
- Frontend: http://localhost:3000 ou http://localhost:3001
- Backend API: http://localhost:3000
- Banco de dados: localhost:5440

---

## 📁 Estrutura do Projeto

```
booker/
│
├── frontend/                    # Aplicação Next.js
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   │   ├── (auth)/        # Rotas de autenticação
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/   # Rotas autenticadas
│   │   │   │   ├── agenda/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── perfil/
│   │   │   │   └── tournaments/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx       # Landing page
│   │   │   └── providers.tsx
│   │   ├── components/        # Componentes reutilizáveis
│   │   │   ├── Header.tsx
│   │   │   ├── LandingHeader.tsx
│   │   │   └── Modal.tsx
│   │   ├── context/           # Context API (Auth)
│   │   ├── hooks/             # Custom hooks
│   │   │   └── useAuth.ts
│   │   ├── lib/               # Utilitários
│   │   │   └── api.ts         # Cliente API
│   │   ├── styles/            # Estilos globais
│   │   ├── util/              # Funções auxiliares
│   │   └── __tests__/         # Testes
│   ├── public/                # Assets estáticos
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── vitest.config.ts
│   └── README.md
│
├── backend/                     # API Express
│   ├── src/
│   │   ├── index.ts           # Entry point
│   │   ├── routes/            # Definição de rotas
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   ├── tournaments.ts
│   │   │   ├── matches.ts
│   │   │   ├── arenas.ts
│   │   │   ├── posts.ts
│   │   │   └── tournament-registrations.ts
│   │   ├── controllers/       # Handlers de requisições
│   │   │   ├── AuthController.ts
│   │   │   ├── UserController.ts
│   │   │   ├── TournamentController.ts
│   │   │   ├── MatchController.ts
│   │   │   ├── ArenaController.ts
│   │   │   ├── PostController.ts
│   │   │   └── TournamentRegistrationController.ts
│   │   ├── services/          # Lógica de negócio
│   │   │   ├── AuthService.ts
│   │   │   ├── UserService.ts
│   │   │   ├── TournamentService.ts
│   │   │   ├── MatchService.ts
│   │   │   ├── ArenaService.ts
│   │   │   ├── PostService.ts
│   │   │   └── TournamentRegistrationService.ts
│   │   └── middleware/        # Middlewares
│   │       └── authMiddleware.ts
│   ├── prisma/
│   │   ├── schema.prisma      # Schema do banco
│   │   ├── migrations/        # Histórico de migrations
│   │   └── seed.ts            # Script de seed
│   ├── doc/                   # Documentação
│   │   └── insomnia-beach-tennis.json  # Coleção Insomnia
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   └── README.md
│
├── package.json               # Scripts do root
└── README.md                  # Este arquivo
```

## 🔧 Configuração Detalhada

### Backend Setup

Veja [backend/README.md](./backend/README.md) para instruções detalhadas sobre:
- Configuração de variáveis de ambiente
- Setup do Docker e PostgreSQL
- Executar migrations
- Popular banco com dados de teste
- Comandos do Prisma

### Frontend Setup

Veja [frontend/README.md](./frontend/README.md) para instruções detalhadas sobre:
- Configuração de variáveis de ambiente
- Estrutura de páginas
- Custom hooks e Context API
- Testes com Vitest

## 📜 Uso e Scripts

### Root - Scripts Globais

```bash
# Instalar dependências em todos os diretórios
npm run install:all

# Executar build do frontend e backend
npm run build

# Iniciar frontend em desenvolvimento
npm run dev:frontend

# Iniciar backend em desenvolvimento
npm run dev:backend
```

### Backend - Scripts

```bash
npm run dev              # Iniciar servidor em desenvolvimento
npm run build            # Compilar TypeScript
npm start                # Iniciar servidor em produção
npm run prisma:generate  # Gerar cliente Prisma
npm run prisma:migrate   # Executar migrations
```

### Frontend - Scripts

```bash
npm run dev              # Iniciar em desenvolvimento
npm run build            # Build para produção
npm start                # Iniciar servidor de produção
npm run lint             # Verificar código com ESLint
npm run format           # Formatar código com Prettier
npm run test             # Rodar testes (watch mode)
npm run test:run         # Rodar testes uma única vez
```

### Docker - Comandos Úteis

```bash
# Subir banco de dados
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs do banco
docker logs booker-db

# Acessar PostgreSQL CLI
docker exec -it booker-db psql -U booker -d booker

# Remover containers e volumes
docker-compose down -v
```

## 🏗️ Arquitetura

### Camadas Backend

```
Routes (Express) 
    ↓
Middleware (Auth)
    ↓
Controllers (Handlers)
    ↓
Services (Business Logic)
    ↓
Prisma ORM
    ↓
PostgreSQL Database
```

### Fluxo Frontend

```
Pages (Next.js)
    ↓
Components (React)
    ↓
Context / Hooks (State Management)
    ↓
API Client (lib/api.ts)
    ↓
Backend API
```

## ✨ Features

### Autenticação
- ✅ Registro de novos usuários
- ✅ Login com JWT
- ✅ Autenticação persistente
- ✅ Proteção de rotas

### Perfil de Usuário
- ✅ Editar dados pessoais
- ✅ Foto de perfil e capa
- ✅ Informações técnicas (mão, tipo de backhand, nível)

### Gerenciamento de Torneios
- ✅ Criar torneios (admin)
- ✅ Listar torneios disponíveis
- ✅ Registrar em torneios

### Agendamento de Partidas
- ✅ Agendar partidas
- ✅ Ver agenda de partidas
- ✅ Atualizar status (agendada, em andamento, finalizada)

### Gerenciamento de Arenas
- ✅ Cadastro de arenas
- ✅ Localização e contato
- ✅ Associar partidas a arenas

### Feed Social
- ✅ Publicar posts
- ✅ Ver feed
- ✅ Compartilhar momentos

## 🔗 API Endpoints

### Auth
```
POST   /api/auth/register     - Registrar novo usuário
POST   /api/auth/login        - Fazer login
GET    /api/auth/me           - Obter usuário autenticado
```

### Users
```
GET    /api/users             - Listar todos os usuários
GET    /api/users/:id         - Obter usuário por ID
PUT    /api/users/:id         - Atualizar usuário
GET    /api/users/:id/stats   - Estatísticas do usuário
```

### Tournaments
```
GET    /api/tournaments       - Listar torneios
POST   /api/tournaments       - Criar torneio
GET    /api/tournaments/:id   - Obter torneio por ID
PUT    /api/tournaments/:id   - Atualizar torneio
DELETE /api/tournaments/:id   - Deletar torneio
```

### Matches
```
GET    /api/matches           - Listar partidas
POST   /api/matches           - Criar partida
GET    /api/matches/:id       - Obter partida por ID
PUT    /api/matches/:id       - Atualizar partida
```

### Tournament Registrations
```
GET    /api/registrations     - Listar registros
POST   /api/registrations     - Se registrar em torneio
DELETE /api/registrations/:id - Cancelar registro
```

### Arenas
```
GET    /api/arenas            - Listar arenas
POST   /api/arenas            - Criar arena
GET    /api/arenas/:id        - Obter arena por ID
PUT    /api/arenas/:id        - Atualizar arena
```

### Posts
```
GET    /api/posts             - Listar posts
POST   /api/posts             - Criar post
DELETE /api/posts/:id         - Deletar post
```

## 🗄️ Banco de Dados

### Modelos Principais

**User** - Usuários cadastrados
- Dados pessoais (nome, email, data nascimento)
- Dados técnicos (tipo de mão, backhand, nível)
- Relacionamentos com torneios, partidas

**Tournament** - Campeonatos
- Informações gerais (nome, datas, status)
- Arena associada
- Usuário criador (admin)
- Registros de participantes

**TournamentRegistration** - Inscrições em torneios
- Vincula usuário a torneio
- Data de inscrição

**Match** - Partidas
- Informações da partida (data, status, placar)
- Arena e torneio associados
- Participantes e times

**Arena** - Locais de jogo
- Nome, endereço, cidade
- Telefone de contato

**Post** - Posts no feed social
- Texto e/ou imagem
- Vinculado ao usuário


### Enums Disponíveis

- **Role**: USER, ADMIN
- **Gender**: MALE, FEMALE, OTHER
- **Level**: PRO, A, B, C
- **HandType**: RIGHT, LEFT
- **BackhandType**: ONE_HAND, TWO_HANDS
- **Status**: OPEN, ONGOING, FINISHED, CANCELED, SCHEDULED

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Deploy automático ao fazer push para main
# Ou manual com Vercel CLI
vercel deploy
```

### Backend (Heroku/Railway/etc)
```bash
# Fazer build
npm run build

# Iniciar servidor de produção
npm start
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

**Última atualização:** Dezembro 2025
