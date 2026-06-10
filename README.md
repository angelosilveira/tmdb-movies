# 🎬 MovieDB — Sistema de Filmes com TMDB

Aplicação React para explorar filmes populares, criar listas de favoritos e descobrir novos conteúdos via API do TMDB.

[![CI](https://github.com/angelosilveira/tmdb-movies/actions/workflows/ci.yml/badge.svg)](https://github.com/angelosilveira/tmdb-movies/actions)

## 🚀 Setup rápido

```bash
git clone https://github.com/angelosilveira/tmdb-movies.git
cd tmdb-movies
npm install
cp .env.example .env   # edite com sua VITE_TMDB_API_KEY
npm run dev            # http://localhost:3000
```

## 🧪 Testes

```bash
npm test               # rodar testes
npm run test:coverage  # com cobertura
npm run test:watch     # modo watch
```

## 📖 Storybook

```bash
npm run storybook      # http://localhost:6006
```

## 🏗️ Arquitetura

Feature-based + Clean Architecture:

- `src/app/` — Providers, Context API, Routes
- `src/features/` — home, movie-details, favorites, search
- `src/shared/` — Componentes UI, hooks, utils, tipos
- `src/infrastructure/` — API client, cache, Sentry, Analytics

## Stack

React 18 · TypeScript · Vite · TanStack Query · React Router v6 · Tailwind CSS · Context API · Axios · Sentry · Google Analytics 4 · Jest · Storybook · Husky · GitHub Actions → Vercel
