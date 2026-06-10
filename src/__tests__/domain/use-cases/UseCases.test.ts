import { GetPopularMoviesUseCase }  from '@/domain/use-cases/GetPopularMoviesUseCase';
import { SearchMoviesUseCase }      from '@/domain/use-cases/SearchMoviesUseCase';
import { GetMovieDetailsUseCase }   from '@/domain/use-cases/GetMovieDetailsUseCase';
import {
  ToggleFavoriteUseCase,
  GetFavoritesUseCase,
  IsFavoriteUseCase,
  RemoveFavoriteUseCase,
} from '@/domain/use-cases/FavoritesUseCases';
import {
  IMovieListRepository,
  IMovieSearchRepository,
  IMovieDetailRepository,
  IFavoritesRepository,
  PaginatedResult,
} from '@/domain/repositories/IMovieRepository';
import { Movie }        from '@/domain/entities/Movie';
import { MovieDetails } from '@/domain/entities/MovieDetails';
import { FavoriteMovie } from '@/domain/entities/FavoriteMovie';

// ─── Mock factories ───────────────────────────────────────────────────────────

function createMovie(overrides: Partial<ConstructorParameters<typeof Movie>[0]> = {}): Movie {
  return new Movie({
    id: 1, title: 'Test', overview: 'Overview', posterUrl: null, backdropUrl: null,
    releaseDate: '2024-01-01', releaseYear: 2024, rating: 7.5, ratingFormatted: '7.5',
    ratingLevel: 'excellent', voteCount: 100, genreIds: [28], popularity: 50,
    isAdult: false, originalLanguage: 'en', originalTitle: 'Test',
    ...overrides,
  });
}

function createPaginatedResult(movies: Movie[]): PaginatedResult<Movie> {
  return { items: movies, page: 1, totalPages: 2, totalResults: movies.length, hasNextPage: true };
}

// ─── Mock Repositories ────────────────────────────────────────────────────────

const mockMovieListRepo: IMovieListRepository = {
  getPopular: jest.fn().mockResolvedValue(createPaginatedResult([createMovie()])),
  getByGenre: jest.fn().mockResolvedValue(createPaginatedResult([createMovie()])),
};

const mockMovieSearchRepo: IMovieSearchRepository = {
  search: jest.fn().mockResolvedValue(createPaginatedResult([createMovie({ title: 'Batman' })])),
};

const mockMovieDetailRepo: IMovieDetailRepository = {
  getById: jest.fn().mockResolvedValue(
    new MovieDetails({
      ...createMovie().toPlainObject(),
      genres: [{ id: 28, name: 'Ação' }],
      runtime: 120, runtimeFormatted: '2h', status: 'Released',
      tagline: null, budget: 0, revenue: 0, homepage: null, imdbId: null,
      productionCompanies: [], spokenLanguages: [],
    }),
  ),
};

let favStore: FavoriteMovie[] = [];
const mockFavoritesRepo: IFavoritesRepository = {
  findAll:  jest.fn(() => [...favStore]),
  add:      jest.fn((movie) => { const f = FavoriteMovie.fromMovie(movie); favStore.push(f); return f; }),
  remove:   jest.fn((id) => { favStore = favStore.filter((f) => f.id !== id); }),
  exists:   jest.fn((id) => favStore.some((f) => f.id === id)),
  clear:    jest.fn(() => { favStore = []; }),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('GetPopularMoviesUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls repository with correct page', async () => {
    const useCase = new GetPopularMoviesUseCase(mockMovieListRepo);
    await useCase.execute({ page: 2 });
    expect(mockMovieListRepo.getPopular).toHaveBeenCalledWith(2);
  });

  it('defaults to page 1 if 0 passed', async () => {
    const useCase = new GetPopularMoviesUseCase(mockMovieListRepo);
    await useCase.execute({ page: 0 });
    expect(mockMovieListRepo.getPopular).toHaveBeenCalledWith(1);
  });

  it('returns paginated result', async () => {
    const useCase = new GetPopularMoviesUseCase(mockMovieListRepo);
    const result = await useCase.execute({ page: 1 });
    expect(result.items).toHaveLength(1);
    expect(result.hasNextPage).toBe(true);
  });
});

describe('SearchMoviesUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns empty result for blank query', async () => {
    const useCase = new SearchMoviesUseCase(mockMovieSearchRepo);
    const result = await useCase.execute({ query: '   ', page: 1 });
    expect(result.items).toHaveLength(0);
    expect(mockMovieSearchRepo.search).not.toHaveBeenCalled();
  });

  it('trims the query before searching', async () => {
    const useCase = new SearchMoviesUseCase(mockMovieSearchRepo);
    await useCase.execute({ query: '  batman  ', page: 1 });
    expect(mockMovieSearchRepo.search).toHaveBeenCalledWith('batman', 1);
  });
});

describe('GetMovieDetailsUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('throws for invalid id', async () => {
    const useCase = new GetMovieDetailsUseCase(mockMovieDetailRepo);
    await expect(useCase.execute({ id: -1 })).rejects.toThrow();
    await expect(useCase.execute({ id: 0 })).rejects.toThrow();
  });

  it('fetches movie by id', async () => {
    const useCase = new GetMovieDetailsUseCase(mockMovieDetailRepo);
    const result = await useCase.execute({ id: 42 });
    expect(mockMovieDetailRepo.getById).toHaveBeenCalledWith(42);
    expect(result.title).toBe('Test');
  });
});

describe('Favorites Use Cases', () => {
  beforeEach(() => { favStore = []; jest.clearAllMocks(); });

  it('ToggleFavoriteUseCase adds movie when not favorited', () => {
    const useCase = new ToggleFavoriteUseCase(mockFavoritesRepo);
    const movie = createMovie();
    const result = useCase.execute({ movie });
    expect(result.isFavorite).toBe(true);
    expect(result.favorites).toHaveLength(1);
  });

  it('ToggleFavoriteUseCase removes movie when already favorited', () => {
    const movie = createMovie();
    favStore.push(FavoriteMovie.fromMovie(movie));
    const useCase = new ToggleFavoriteUseCase(mockFavoritesRepo);
    const result = useCase.execute({ movie });
    expect(result.isFavorite).toBe(false);
    expect(result.favorites).toHaveLength(0);
  });

  it('GetFavoritesUseCase returns all favorites', () => {
    favStore.push(FavoriteMovie.fromMovie(createMovie({ id: 1 })));
    favStore.push(FavoriteMovie.fromMovie(createMovie({ id: 2 })));
    const useCase = new GetFavoritesUseCase(mockFavoritesRepo);
    expect(useCase.execute()).toHaveLength(2);
  });

  it('IsFavoriteUseCase returns correct boolean', () => {
    favStore.push(FavoriteMovie.fromMovie(createMovie({ id: 5 })));
    const useCase = new IsFavoriteUseCase(mockFavoritesRepo);
    expect(useCase.execute(5)).toBe(true);
    expect(useCase.execute(99)).toBe(false);
  });

  it('RemoveFavoriteUseCase removes by id', () => {
    favStore.push(FavoriteMovie.fromMovie(createMovie({ id: 3 })));
    const useCase = new RemoveFavoriteUseCase(mockFavoritesRepo);
    const result = useCase.execute(3);
    expect(result).toHaveLength(0);
  });
});
