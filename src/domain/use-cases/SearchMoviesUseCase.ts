// ─────────────────────────────────────────────────────────────────────────────
// USE CASE: SearchMovies
//
// SOLID — SRP: única responsabilidade — buscar filmes por termo.
//         DIP: depende de IMovieSearchRepository (abstração).
// ─────────────────────────────────────────────────────────────────────────────

import { IMovieSearchRepository, PaginatedResult } from '@/domain/repositories/IMovieRepository';
import { Movie } from '@/domain/entities/Movie';

export interface SearchMoviesInput {
  query: string;
  page: number;
}

export class SearchMoviesUseCase {
  constructor(
    private readonly movieRepository: IMovieSearchRepository,
  ) {}

  async execute(input: SearchMoviesInput): Promise<PaginatedResult<Movie>> {
    const query = input.query.trim();

    if (!query) {
      return { items: [], page: 1, totalPages: 0, totalResults: 0, hasNextPage: false };
    }

    return this.movieRepository.search(query, Math.max(1, input.page));
  }
}
