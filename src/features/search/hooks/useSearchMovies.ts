import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/infrastructure/cache/queryClient';
import { moviesService } from '@/features/home/services/movies.service';
import { Movie, PaginatedResult } from '@/shared/types/movie.types';

export function useSearchMovies(query: string) {
  return useInfiniteQuery<PaginatedResult<Movie>, Error>({
    queryKey: queryKeys.movies.search(query, 1),
    queryFn: ({ pageParam }) => moviesService.search(query, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 2,
  });
}
