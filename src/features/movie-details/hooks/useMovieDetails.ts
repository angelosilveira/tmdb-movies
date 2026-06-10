// SRP: hook responsável apenas por expor detalhes de um filme.
// DIP: consome getMovieDetailsUseCase (abstração).

import { useQuery }               from '@tanstack/react-query';
import { useEffect }              from 'react';
import { queryKeys }              from '@/infrastructure/cache/queryClient';
import { getMovieDetailsUseCase } from '@/app/container';
import { analytics }              from '@/infrastructure/analytics/ga';

export function useMovieDetails(id: number) {
  const query = useQuery({
    queryKey: queryKeys.movies.details(id),
    queryFn:  () => getMovieDetailsUseCase.execute({ id }),
    enabled:  !!id && id > 0,
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (query.data) {
      analytics.events.viewMovieDetails(id, query.data.title);
    }
  }, [query.data, id]);

  return query;
}
