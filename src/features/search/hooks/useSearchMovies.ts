// SRP: hook responsável apenas por expor resultados de busca ao React.
// DIP: consome searchMoviesUseCase (abstração).

import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys }            from '@/infrastructure/cache/queryClient';
import { searchMoviesUseCase }  from '@/app/container';
import { Movie }                from '@/domain/entities/Movie';
import { PaginatedResult }      from '@/domain/repositories/IMovieRepository';

export function useSearchMovies(query: string) {
  return useInfiniteQuery<PaginatedResult<Movie>, Error>({
    queryKey:      queryKeys.movies.search(query, 1),
    queryFn:       ({ pageParam }) =>
      searchMoviesUseCase.execute({ query, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    enabled:   query.trim().length > 0,
    staleTime: 1000 * 60 * 2,
  });
}
