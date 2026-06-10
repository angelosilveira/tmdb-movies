import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/infrastructure/cache/queryClient';
import { moviesService } from '@/features/home/services/movies.service';
import { analytics } from '@/infrastructure/analytics/ga';
import { useEffect } from 'react';

export function useMovieDetails(id: number) {
  const query = useQuery({
    queryKey: queryKeys.movies.details(id),
    queryFn: () => moviesService.getDetails(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (query.data) {
      analytics.events.viewMovieDetails(id, query.data.title);
    }
  }, [query.data, id]);

  return query;
}
