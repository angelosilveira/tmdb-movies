import { useQuery } from '@tanstack/react-query';
import { queryKeys }              from '@/infrastructure/cache/queryClient';
import { getMoviesByGenreUseCase } from '@/app/container';

export function useMoviesByGenre(genreId: number) {
  return useQuery({
    queryKey: queryKeys.movies.genre(genreId, 1),
    queryFn:  () => getMoviesByGenreUseCase.execute({ genreId, page: 1 }),
    staleTime: 1000 * 60 * 10,
  });
}
