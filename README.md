# 🎬 MovieDB — Sistema de Filmes com TMDB

Aplicação React para explorar filmes populares, criar listas de favoritos e descobrir novos conteúdos usando a API do The Movie Database (TMDB).

**[→ Demo ao vivo](https://tmdb-movies-sigma.vercel.app)**

---

## ⚡ Início rápido

```bash
git clone https://github.com/angelosilveira/tmdb-movies.git
cd tmdb-movies
yarn install
yarn setup   # cria o .env com tudo pronto — sem necessidade de criar contas
yarn dev     # http://localhost:3000
```

> O `yarn setup` copia o `.env.example` para `.env`. O token do TMDB já está incluído e funciona imediatamente. Sentry e Google Analytics são opcionais e ficam desabilitados por padrão.

---

## 📋 Funcionalidades

| Página | Rota | Descrição |
|--------|------|-----------|
| Home | `/` | Grid de filmes populares com infinite scroll |
| Detalhes | `/movie/:id` | Sinopse, gêneros, nota, duração e favoritar |
| Favoritos | `/favorites` | Lista pessoal com ordenação A-Z e por nota |
| Busca | `/search?q=termo` | Resultados com destaque do termo buscado |

---

## 🏗️ Arquitetura

O projeto segue **Clean Architecture** com estrutura **Feature-based**, garantindo separação clara de responsabilidades e total independência entre camadas.

```
src/
├── domain/                     ← Camada de domínio (núcleo — zero dependências externas)
│   ├── entities/               ← Movie, MovieDetails, FavoriteMovie (classes com regras)
│   │   ├── Movie.ts
│   │   ├── MovieDetails.ts
│   │   └── FavoriteMovie.ts
│   ├── value-objects/          ← Rating (imutável, validado)
│   ├── repositories/           ← Interfaces IMovieRepository, IFavoritesRepository
│   └── use-cases/              ← GetPopularMovies, Search, GetDetails, Favorites
│
├── infrastructure/             ← Implementações concretas (detalhe de implementação)
│   ├── api/
│   │   ├── client.ts           ← Axios com interceptors e Sentry
│   │   └── tmdb.types.ts       ← Tipos RAW da API TMDB (isolados aqui)
│   ├── adapters/
│   │   └── movie.adapter.ts    ← Converte TMDB → domínio (único ponto de contato com a API)
│   ├── repositories/
│   │   ├── TmdbMovieRepository.ts
│   │   └── LocalStorageFavoritesRepository.ts
│   ├── cache/                  ← TanStack Query client e query keys
│   ├── analytics/              ← Google Analytics 4
│   └── monitoring/             ← Sentry
│
├── app/                        ← Composição e estado global
│   ├── container.ts            ← Composition Root (único lugar com new ConcreteClass())
│   ├── contexts/               ← FavoritesContext (Context API + useReducer)
│   ├── providers/              ← AppProviders (QueryClient, Sentry ErrorBoundary)
│   └── routes/                 ← React Router v6 com code splitting (lazy)
│
├── features/                   ← Módulos por funcionalidade
│   ├── home/                   ← hooks/usePopularMovies, pages/HomePage
│   ├── movie-details/          ← hooks/useMovieDetails, pages/MovieDetailsPage
│   ├── favorites/              ← pages/FavoritesPage
│   └── search/                 ← hooks/useSearchMovies, pages/SearchPage
│
└── shared/                     ← Código compartilhado entre features
    ├── components/
    │   ├── ui/                 ← MovieCard, Button, RatingBadge, Skeleton, ErrorState
    │   └── layout/             ← Header, RootLayout
    ├── utils/                  ← format, highlight, debounce, clsx
    └── constants/              ← URLs de imagem, chaves de storage
```

### Camadas e dependências

```
domain  ←  infrastructure  ←  app  ←  features  ←  shared
  ↑               ↑
  └── nunca importa de cima
```

A camada de **domínio** não conhece React, Axios, localStorage nem nenhuma lib externa. Os **adapters** são o único lugar que conhece a estrutura da API do TMDB — se a API mudar, só o adapter precisa ser atualizado.

---

## 🧱 Princípios SOLID

| Princípio | Aplicação no projeto |
|-----------|---------------------|
| **S** — Single Responsibility | Cada use case tem uma responsabilidade; entidades só contêm regras de domínio |
| **O** — Open/Closed | Novo storage = nova `implements IFavoritesRepository` sem tocar no domínio |
| **L** — Liskov Substitution | `MovieDetails extends Movie` substitui `Movie` em qualquer lugar |
| **I** — Interface Segregation | `IMovieListRepository`, `IMovieSearchRepository` e `IMovieDetailRepository` separados |
| **D** — Dependency Inversion | Use cases dependem de interfaces; `container.ts` injeta as implementações |

---

## 🛠️ Stack técnica

### Produção

| Pacote | Versão | Finalidade |
|--------|--------|-----------|
| `react` | 18.3 | Framework UI |
| `react-dom` | 18.3 | Renderização DOM |
| `react-router-dom` | 6.28 | Roteamento SPA |
| `@tanstack/react-query` | 5.62 | Cache, fetching e estado de servidor |
| `axios` | 1.7 | Cliente HTTP com interceptors |
| `@sentry/react` | 8.55 | Monitoramento de erros e performance |
| `react-ga4` | 2.1 | Google Analytics 4 |

### Desenvolvimento

| Pacote | Versão | Finalidade |
|--------|--------|-----------|
| `vite` | 5.4 | Build e dev server |
| `typescript` | 5.6 | Tipagem estática (strict mode) |
| `tailwindcss` | 3.4 | Estilização utility-first |
| `jest` | 29.7 | Test runner |
| `@testing-library/react` | 16.1 | Testes de componentes |
| `ts-jest` | 29.2 | TypeScript no Jest |
| `storybook` | 8.6 | Documentação de componentes |
| `husky` | 9.1 | Git hooks |
| `lint-staged` | 15.2 | Lint nos arquivos staged |
| `eslint` | 9.15 | Linting |
| `prettier` | 3.3 | Formatação de código |

---

## 🎨 Design System

Tokens definidos em `tailwind.config.js`:

```js
colors: {
  brand:   { primary: '#3B82F6', secondary: '#F59E0B', accent: '#8B5CF6' }
  surface: { base: '#0F172A', elevated: '#1E293B', overlay: '#334155' }
  text:    { primary: '#F8FAFC', secondary: '#94A3B8', muted: '#64748B' }
  rating:  { excellent: '#22C55E', good: '#F59E0B', average: '#EF4444' }
}
```

Animações: `fade-in`, `slide-up`, `shimmer` (skeleton loading).

---

## 🧪 Testes

```bash
yarn test              # roda todos os testes
yarn test:watch        # modo watch (desenvolvimento)
yarn test:coverage     # com relatório de cobertura
```

**Suites cobertas:**

| Suite | O que testa |
|-------|-------------|
| `movie.adapter.test.ts` | Conversão TMDB → domínio, backward compat do localStorage |
| `FavoritesContext.test.tsx` | Estado global: add, remove, toggle, sort, persistência |
| `MovieCard.test.tsx` | Render, favoritar, deletar, highlight, acessibilidade |
| `Button.test.tsx` | Variants, loading, disabled, ícones |
| `RatingBadge.test.tsx` | Cores por nível, tamanhos, aria-label |
| `ErrorState.test.tsx` | Default e custom props, retry callback |
| `format.test.ts` | formatDate, formatRating, highlightText, debounce, clsx |
| `movies.service.test.ts` | TmdbMovieRepository: todos os endpoints |
| `UseCases.test.ts` | Todos os use cases com repositórios mockados |

---

## 📖 Storybook

```bash
yarn storybook   # http://localhost:6006
```

Componentes documentados: `Button`, `RatingBadge`, `MovieCard`.

---

## 🔧 Scripts disponíveis

```bash
yarn setup          # configura o .env local (execute uma vez após clonar)
yarn dev            # servidor de desenvolvimento — http://localhost:3000
yarn build          # build de produção
yarn preview        # preview do build gerado
yarn test           # testes unitários
yarn test:watch     # testes em modo watch
yarn test:coverage  # testes com cobertura
yarn storybook      # Storybook — http://localhost:6006
yarn lint           # ESLint
yarn lint:fix       # ESLint com auto-fix
yarn format         # Prettier
yarn type-check     # TypeScript sem emitir arquivos
```

---

## 📁 Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `VITE_TMDB_READ_TOKEN` | ✅ Já configurada | Token JWT de leitura do TMDB |
| `VITE_TMDB_BASE_URL` | ✅ Já configurada | URL base da API |
| `VITE_TMDB_IMAGE_BASE_URL` | ✅ Já configurada | URL base das imagens |
| `VITE_SENTRY_DSN` | ❌ Opcional | DSN do projeto Sentry |
| `VITE_GA_MEASUREMENT_ID` | ❌ Opcional | ID do Google Analytics 4 |

Execute `yarn setup` para criar o `.env` automaticamente.

---

## 🔒 Git Hooks (Husky)

| Hook | Ação |
|------|------|
| `pre-commit` | `lint-staged` — ESLint + Prettier nos arquivos staged |
| `pre-push` | `yarn test:ci` — bloqueia push se testes falharem |

---

## 📦 Requisitos

| Ferramenta | Versão mínima |
|------------|--------------|
| Node.js | 18+ (recomendado: 22) |
| Yarn | 1.22+ |

```bash
# Verificar versões
node --version
yarn --version
```

---

## 🤝 Contribuindo

```bash
# 1. Fork e clone
git clone https://github.com/seu-usuario/tmdb-movies.git

# 2. Configure o ambiente
yarn install && yarn setup

# 3. Crie uma branch
git checkout -b feat/minha-feature

# 4. Desenvolva, teste e commit
yarn test
git commit -m "feat: minha feature"

# 5. Push — os testes rodam automaticamente antes
git push origin feat/minha-feature
```
