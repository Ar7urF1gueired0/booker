# 🎾 Beach Tennis Frontend

Aplicação web construída com **Next.js 14**, **TypeScript**, **Tailwind CSS** e **Material UI**.

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- npm ou yarn
- Backend rodando (ver `/backend/README.md`)

## 🚀 Iniciando o Projeto

### 1. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na pasta `frontend/` com as seguintes variáveis:

```env
# URL da API do Backend
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:3001**

> **Nota:** O Next.js usa a porta 3000 por padrão, mas se o backend já estiver usando, ele automaticamente usará a próxima porta disponível (3001).

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor em modo desenvolvimento (hot-reload) |
| `npm run build` | Compila a aplicação para produção |
| `npm start` | Inicia o servidor em modo produção |
| `npm run lint` | Executa o ESLint para verificar código |
| `npm run format` | Formata o código com Prettier |
| `npm run test` | Executa os testes em modo watch |
| `npm run test:run` | Executa os testes uma única vez |

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/           # Rotas de autenticação
│   │   │   ├── login/        # Página de login
│   │   │   └── register/     # Página de registro
│   │   ├── (dashboard)/      # Rotas autenticadas
│   │   │   ├── dashboard/    # Página principal
│   │   │   ├── perfil/       # Página de perfil
│   │   │   └── tournaments/  # Página de torneios
│   │   ├── layout.tsx        # Layout principal
│   │   ├── page.tsx          # Landing page
│   │   └── providers.tsx     # Providers (contextos)
│   ├── components/           # Componentes reutilizáveis
│   ├── context/              # Contextos React (Auth, etc.)
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilitários e API client
│   ├── styles/               # Estilos globais
│   └── util/                 # Funções utilitárias
├── public/                   # Assets estáticos
├── package.json
├── tailwind.config.js        # Configuração do Tailwind
├── tsconfig.json             # Configuração do TypeScript
└── vitest.config.ts          # Configuração dos testes
```

## 🔗 Páginas da Aplicação

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/login` | Página de login |
| `/register` | Página de registro |
| `/dashboard` | Dashboard principal (autenticado) |
| `/perfil` | Perfil do usuário (autenticado) |
| `/tournaments` | Lista de torneios (autenticado) |

## 🧪 Testes

O projeto usa **Vitest** para testes:

```bash
# Rodar testes em modo watch
npm run test

# Rodar testes uma vez
npm run test:run
```

## 🛠️ Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Material UI** - Biblioteca de componentes
- **Emotion** - CSS-in-JS (usado pelo MUI)
- **Lucide React** - Ícones
- **Notistack** - Notificações/toasts
- **Vitest** - Framework de testes

## 💡 Dicas

### Desenvolvimento

1. Certifique-se de que o **backend está rodando** antes de iniciar o frontend
2. Use `npm run lint` para verificar erros de código
3. Use `npm run format` para manter o código formatado

### Produção

```bash
# Build da aplicação
npm run build

# Iniciar em produção
npm start
```
