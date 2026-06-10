// ─────────────────────────────────────────────────────────────────────────────
// USE CASE: GetMovieDetails
//
// SOLID — SRP: única responsabilidade — buscar detalhes de um filme por ID.
//         DIP: depende de IMovieDetailRepository (abstração).
// ─────────────────────────────────────────────────────────────────────────────

import { IMovieDetailRepository } from '@/domain/repositories/IMovieRepository';
import { MovieDetails }           from '@/domain/entities/MovieDetails';

export interface GetMovieDetailsInput {
  id: number;
}

export class GetMovieDetailsUseCase {
  constructor(
    private readonly movieRepository: IMovieDetailRepository,
  ) {}

  async execute(input: GetMovieDetailsInput): Promise<MovieDetails> {
    if (!input.id || input.id <= 0) {
      throw new Error(`ID de filme inválido: ${input.id}`);
    }
    return this.movieRepository.getById(input.id);
  }
}
