import { IMovieListRepository, PaginatedResult } from '../repositories/IMovieRepository';
import { Movie } from '../entities/Movie';

interface Input {
  genreId: number;
  page?: number;
}

export class GetMoviesByGenreUseCase {
  constructor(private readonly repo: IMovieListRepository) {}

  execute({ genreId, page = 1 }: Input): Promise<PaginatedResult<Movie>> {
    return this.repo.getByGenre(genreId, page);
  }
}
