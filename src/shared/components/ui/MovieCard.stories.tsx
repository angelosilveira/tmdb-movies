import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MovieCard } from '@/shared/components/ui/MovieCard';
import { Movie } from '@/domain/entities/Movie';

const makeMovie = (overrides: Partial<ConstructorParameters<typeof Movie>[0]> = {}): Movie =>
  new Movie({
    id: 550,
    title: 'Fight Club',
    overview: 'Um insone e descontente homem de manutenção cria um clube secreto de luta com um vendedor de sabão.',
    posterUrl: 'https://image.tmdb.org/t/p/w300/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg',
    releaseDate: '1999-10-15',
    releaseYear: 1999,
    rating: 8.4,
    ratingFormatted: '8.4',
    ratingLevel: 'excellent',
    voteCount: 26280,
    genreIds: [18],
    popularity: 61.416,
    isAdult: false,
    originalLanguage: 'en',
    originalTitle: 'Fight Club',
    ...overrides,
  });

const mockMovie = makeMovie();

const meta: Meta<typeof MovieCard> = {
  title: 'Features/MovieCard',
  component: MovieCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { movie: mockMovie },
  decorators: [(Story) => <div className="w-48"><Story /></div>],
};

export const WithDeleteIcon: Story = {
  args: { movie: mockMovie, showDeleteIcon: true, onDelete: (id: number) => alert(`Remover ${id}`) },
  decorators: [(Story) => <div className="w-48"><Story /></div>],
};

export const WithHighlight: Story = {
  args: { movie: mockMovie, highlight: 'Fight' },
  decorators: [(Story) => <div className="w-48"><Story /></div>],
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[600px]">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <MovieCard key={i} movie={makeMovie({ id: i, title: `Filme ${i}`, rating: 5 + i * 0.5, ratingFormatted: (5 + i * 0.5).toFixed(1) })} />
      ))}
    </div>
  ),
};
