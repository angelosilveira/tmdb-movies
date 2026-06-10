// ─────────────────────────────────────────────────────────────────────────────
// USE CASE: GetPopularMovies
//
// SOLID — SRP: responsabilidade única — obter filmes populares paginados.
//         DIP: recebe IMovieListRepository via construtor (injeção de dependência).
//              Não sabe se os dados vêm do TMDB, de um cache ou de um mock.
//
// Clean Architecture: Application layer orquestra domínio + repositório.
// Sem React, sem Axios, sem nada de framework aqui.
// ─────────────────────────────────────────────────────────────────────────────

import { IMovieListRepository, PaginatedResult } from '@/domain/repositories/IMovieRepository';
import { Movie } from '@/domain/entities/Movie';

export interface GetPopularMoviesInput {
  page: number;
}

export class GetPopularMoviesUseCase {
  constructor(
    private readonly movieRepository: IMovieListRepository,
  ) {}

  async execute(input: GetPopularMoviesInput): Promise<PaginatedResult<Movie>> {
    const page = Math.max(1, input.page);
    return this.movieRepository.getPopular(page);
  }
}
