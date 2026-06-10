import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { MovieCard } from '@/shared/components/ui/MovieCard';
import { renderWithProviders, createMockMovie } from '../../helpers/testUtils';

const movie = createMockMovie({ id: 1, title: 'Inception', vote_average: 8.8 });

describe('MovieCard', () => {
  it('renders movie title', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });

  it('renders movie rating badge', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    expect(screen.getByText('8.8')).toBeInTheDocument();
  });

  it('links to movie details page', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    const link = screen.getByRole('link', { name: /ver detalhes de inception/i });
    expect(link).toHaveAttribute('href', '/movie/1');
  });

  it('renders favorite button (not delete) by default', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    expect(screen.getByRole('button', { name: /adicionar inception aos favoritos/i })).toBeInTheDocument();
  });

  it('shows delete icon when showDeleteIcon=true', () => {
    renderWithProviders(<MovieCard movie={movie} showDeleteIcon onDelete={jest.fn()} />);
    expect(screen.getByRole('button', { name: /remover inception dos favoritos/i })).toBeInTheDocument();
  });

  it('calls onDelete with movie id when delete button clicked', () => {
    const onDelete = jest.fn();
    renderWithProviders(<MovieCard movie={movie} showDeleteIcon onDelete={onDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /remover inception dos favoritos/i }));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('toggles favorite on button click', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    const btn = screen.getByRole('button', { name: /adicionar inception aos favoritos/i });
    fireEvent.click(btn);
    expect(screen.getByRole('button', { name: /remover inception dos favoritos/i })).toBeInTheDocument();
  });

  it('highlights matching text when highlight prop is provided', () => {
    renderWithProviders(<MovieCard movie={movie} highlight="Inception" />);
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });

  it('renders poster image with alt text', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    expect(screen.getByAltText('Poster de Inception')).toBeInTheDocument();
  });

  it('shows filled heart icon when movie is already favorited', () => {
    renderWithProviders(<MovieCard movie={movie} />);

    // Add to favorites
    const btn = screen.getByRole('button', { name: /adicionar/i });
    fireEvent.click(btn);

    // Now check aria-pressed
    const favoriteBtn = screen.getByRole('button', { name: /remover inception dos favoritos/i });
    expect(favoriteBtn).toHaveAttribute('aria-pressed', 'true');
  });
});
