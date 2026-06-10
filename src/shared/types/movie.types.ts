// ─────────────────────────────────────────────────────────────────────────────
// Re-exports das entidades de domínio para uso na camada de apresentação.
// Os componentes React importam daqui — não importam diretamente do domínio.
//
// SOLID — DIP: a UI depende dessas abstrações, não das entidades concretas.
// ─────────────────────────────────────────────────────────────────────────────

export type { RatingLevel }      from '@/domain/entities/Movie';
export { Movie }                 from '@/domain/entities/Movie';
export type { MovieProps }       from '@/domain/entities/Movie';
export { MovieDetails }          from '@/domain/entities/MovieDetails';
export type { MovieDetailsProps, Genre, ProductionCompany, SpokenLanguage } from '@/domain/entities/MovieDetails';
export { FavoriteMovie }         from '@/domain/entities/FavoriteMovie';
export type { FavoriteMovieProps } from '@/domain/entities/FavoriteMovie';
export type { PaginatedResult }  from '@/domain/repositories/IMovieRepository';
export type { SortOption }       from '@/app/contexts/FavoritesContext';
