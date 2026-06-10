import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { MovieCard } from '@/shared/components/ui/MovieCard';
import { renderWithProviders, createMockMovie } from '../../helpers/testUtils';

const movie = createMockMovie({ id: 1, title: 'Inception', rating: 8.8 });

describe('MovieCard', () => {
  it('renders movie title (at least one occurrence)', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    // New design renders title in two places (static + hover overlay)
    const titles = screen.getAllByText('Inception');
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it('renders movie rating as text', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    // Rating appears in overlay and badge — find at least one
    const ratings = screen.getAllByText('8.8');
    expect(ratings.length).toBeGreaterThanOrEqual(1);
  });

  it('links to movie details page', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    const link = screen.getByRole('link', { name: /ver detalhes de inception/i });
    expect(link).toHaveAttribute('href', '/movie/1');
  });

  it('renders favorite button by default', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    const btn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-label')?.toLowerCase().includes('adicionar'),
    );
    expect(btn).toBeDefined();
  });

  it('renders delete button when showDeleteIcon=true', () => {
    renderWithProviders(<MovieCard movie={movie} showDeleteIcon onDelete={jest.fn()} />);
    const btn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-label')?.toLowerCase().includes('remover'),
    );
    expect(btn).toBeDefined();
  });

  it('calls onDelete with movie id when delete button clicked', () => {
    const onDelete = jest.fn();
    renderWithProviders(<MovieCard movie={movie} showDeleteIcon onDelete={onDelete} />);
    const btn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-label')?.toLowerCase().includes('remover'),
    )!;
    fireEvent.click(btn);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('toggles favorite state on button click', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    const addBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-label')?.toLowerCase().includes('adicionar'),
    )!;
    expect(addBtn).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(addBtn);
    const removeBtn = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-label')?.toLowerCase().includes('remover'),
    )!;
    expect(removeBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders poster image with alt text', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    expect(screen.getByAltText('Poster de Inception')).toBeInTheDocument();
  });

  it('highlights matching text when highlight prop provided', () => {
    renderWithProviders(<MovieCard movie={movie} highlight="Inception" />);
    // There are multiple instances — check at least one mark element exists
    const marks = document.querySelectorAll('mark');
    expect(marks.length).toBeGreaterThan(0);
  });
});
