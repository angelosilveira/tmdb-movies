import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/infrastructure/cache/queryClient';
import { moviesService } from '../services/movies.service';
import { Movie, PaginatedResult } from '@/shared/types/movie.types';

export function usePopularMovies() {
  return useInfiniteQuery<PaginatedResult<Movie>, Error>({
    queryKey: queryKeys.movies.popular(1),
    queryFn: ({ pageParam }) => moviesService.getPopular(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 5,
  });
}
