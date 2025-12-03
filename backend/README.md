# 🎾 Beach Tennis Backend

API RESTful construída com **Express.js**, **TypeScript** e **Prisma ORM**.

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) v18+ 
- [Docker](https://www.docker.com/) e Docker Compose
- npm ou yarn

## 🚀 Iniciando o Projeto

### 1. Configurar variáveis de ambiente

Crie um arquivo `.env` na pasta `backend/` com as seguintes variáveis:

```env
# Banco de Dados PostgreSQL
POSTGRES_USER=booker
POSTGRES_PASSWORD=booker
POSTGRES_DB=booker
POSTGRES_PORT=5440

# URL de conexão do Prisma
DATABASE_URL="postgresql://booker:booker@localhost:5440/booker?schema=public"

# JWT Secret (para autenticação)
JWT_SECRET=sua_chave_secreta_aqui
```

### 2. Subir o banco de dados com Docker

```bash
docker-compose up -d
```

Isso irá criar um container PostgreSQL na porta **5440**.

> **Verificar status:** `docker ps` - o container `booker-db` deve estar rodando.

### 3. Instalar dependências

```bash
npm install
```

### 4. Configurar o Prisma

Gerar o cliente Prisma e executar as migrations:

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrations (criar tabelas no banco)
npm run prisma:migrate
```

### 5. (Opcional) Popular o banco com dados de teste

```bash
npx prisma db seed
```

### 6. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em: **http://localhost:3000**

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor em modo desenvolvimento (hot-reload) |
| `npm run build` | Compila o TypeScript para JavaScript |
| `npm start` | Inicia o servidor em modo produção |
| `npm run prisma:generate` | Gera o cliente Prisma |
| `npm run prisma:migrate` | Executa as migrations do banco de dados |

## 🐳 Docker

### Comandos úteis

```bash
# Subir containers
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs do banco
docker logs booker-db

# Acessar o PostgreSQL via CLI
docker exec -it booker-db psql -U booker -d booker
```

### Configuração do Docker Compose

O `docker-compose.yml` configura:
- **PostgreSQL** na porta 5440 (mapeada para 5432 interna)
- Volume persistente `postgres_data` para os dados
- Health check automático

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── index.ts              # Entry point do servidor
│   ├── routes/               # Definição das rotas da API
│   ├── controllers/          # Handlers das requisições
│   ├── services/             # Lógica de negócio
│   └── middleware/           # Middlewares (auth, etc.)
├── prisma/
│   ├── schema.prisma         # Schema do banco de dados
│   ├── migrations/           # Histórico de migrations
│   └── seed.ts               # Script para popular o banco
├── docker-compose.yml        # Configuração do Docker
├── Dockerfile                # Imagem do PostgreSQL
├── package.json
└── tsconfig.json
```

## 🔗 Endpoints da API

### Health Check
- `GET /health` - Verifica se a API está funcionando

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

### Torneios
- `GET /api/tournaments` - Listar torneios
- `POST /api/tournaments` - Criar torneio
- `GET /api/tournaments/:id` - Buscar torneio por ID

### Usuários
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário por ID

## 🛠️ Tecnologias

- **Express.js** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação via tokens
- **bcryptjs** - Hash de senhas
- **Zod** - Validação de schemas
