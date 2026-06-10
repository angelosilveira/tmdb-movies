// SRP: hook responsável apenas por expor filmes populares ao React.
// DIP: consome getPopularMoviesUseCase (abstração), não o repositório diretamente.

import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys }               from '@/infrastructure/cache/queryClient';
import { getPopularMoviesUseCase } from '@/app/container';
import { Movie }                   from '@/domain/entities/Movie';
import { PaginatedResult }         from '@/domain/repositories/IMovieRepository';

export function usePopularMovies() {
  return useInfiniteQuery<PaginatedResult<Movie>, Error>({
    queryKey:      queryKeys.movies.popular(1),
    queryFn:       ({ pageParam }) =>
      getPopularMoviesUseCase.execute({ page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 5,
  });
}
