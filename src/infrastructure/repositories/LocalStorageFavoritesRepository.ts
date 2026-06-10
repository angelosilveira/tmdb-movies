// ─────────────────────────────────────────────────────────────────────────────
// INFRASTRUCTURE: LocalStorageFavoritesRepository
//
// SOLID — DIP: implementa IFavoritesRepository.
//         SRP: responsável apenas pela persistência de favoritos no localStorage.
//         OCP: para usar outro storage (IndexedDB, API), basta criar outra impl.
//
// Clean Architecture: detalhe de infraestrutura isolado. O domínio
// não sabe que os dados são salvos no browser.
// ─────────────────────────────────────────────────────────────────────────────

import { IFavoritesRepository }        from '@/domain/repositories/IMovieRepository';
import { Movie }                       from '@/domain/entities/Movie';
import { FavoriteMovie }               from '@/domain/entities/FavoriteMovie';
import { adaptStoredFavorite }         from '@/infrastructure/adapters/movie.adapter';

const STORAGE_KEY = 'tmdb_favorites';

export class LocalStorageFavoritesRepository implements IFavoritesRepository {
  private cache: FavoriteMovie[] | null = null;

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private load(): FavoriteMovie[] {
    if (this.cache !== null) return this.cache;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return (this.cache = []);

      const parsed = JSON.parse(raw) as unknown[];
      if (!Array.isArray(parsed)) return (this.cache = []);

      this.cache = parsed
        .map(adaptStoredFavorite)
        .filter((m): m is ReturnType<typeof adaptStoredFavorite> & FavoriteMovie => m !== null)
        .map((plain) => new FavoriteMovie(plain as ConstructorParameters<typeof FavoriteMovie>[0]));

      return this.cache;
    } catch {
      console.warn('[FavoritesRepo] Falha ao ler localStorage');
      return (this.cache = []);
    }
  }

  private persist(favorites: FavoriteMovie[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.map((f) => f.toPlainObject())));
      this.cache = favorites;
    } catch {
      console.warn('[FavoritesRepo] Falha ao persistir no localStorage');
    }
  }

  // ─── IFavoritesRepository ─────────────────────────────────────────────────

  findAll(): FavoriteMovie[] {
    return [...this.load()];
  }

  add(movie: Movie): FavoriteMovie {
    const favorites = this.load();
    if (this.exists(movie.id)) {
      return favorites.find((f) => f.id === movie.id)!;
    }
    const favorite = FavoriteMovie.fromMovie(movie);
    this.persist([...favorites, favorite]);
    return favorite;
  }

  remove(movieId: number): void {
    const updated = this.load().filter((f) => f.id !== movieId);
    this.persist(updated);
  }

  exists(movieId: number): boolean {
    return this.load().some((f) => f.id === movieId);
  }

  clear(): void {
    this.persist([]);
  }

  /** Invalida o cache em memória (útil para testes) */
  invalidateCache(): void {
    this.cache = null;
  }
}
