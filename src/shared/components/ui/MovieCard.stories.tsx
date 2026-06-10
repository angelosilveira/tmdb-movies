import type { Meta, StoryObj } from '@storybook/react';
import { MovieCard } from '@/shared/components/ui/MovieCard';


// Re-export mock for Storybook
const mockMovie = {
  id: 550,
  title: 'Fight Club',
  overview: 'Um insone e descontente homem de manutenção cria um clube secreto de luta com um vendedor de sabão.',
  poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  backdrop_path: '/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg',
  release_date: '1999-10-15',
  vote_average: 8.4,
  vote_count: 26280,
  genre_ids: [18],
  popularity: 61.416,
  adult: false,
  original_language: 'en',
  original_title: 'Fight Club',
};

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
  args: { movie: mockMovie, showDeleteIcon: true, onDelete: (id) => alert(`Remover ${id}`) },
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
        <MovieCard
          key={i}
          movie={{ ...mockMovie, id: i, title: `Filme ${i}`, vote_average: 5 + i * 0.5 }}
        />
      ))}
    </div>
  ),
};
