import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { MovieCard } from '@/shared/components/ui/MovieCard';
import { renderWithProviders, createMockMovie } from '../../helpers/testUtils';

const movie = createMockMovie({ id: 1, title: 'Inception', rating: 8.8 });

describe('MovieCard', () => {
  it('renders movie title', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });

  it('renders movie rating badge via aria-label', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    expect(screen.getByLabelText('Nota: 8.8')).toBeInTheDocument();
  });

  it('links to movie details page', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    expect(
      screen.getByRole('link', { name: /ver detalhes de inception/i }),
    ).toHaveAttribute('href', '/movie/1');
  });

  it('renders favorite button by default (not delete)', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    const btn = screen
      .getAllByRole('button')
      .find((b) => b.getAttribute('aria-label')?.toLowerCase().includes('adicionar'));
    expect(btn).toBeDefined();
  });

  it('renders delete button when showDeleteIcon=true', () => {
    renderWithProviders(<MovieCard movie={movie} showDeleteIcon onDelete={jest.fn()} />);
    const btn = screen
      .getAllByRole('button')
      .find((b) => b.getAttribute('aria-label')?.toLowerCase().includes('remover'));
    expect(btn).toBeDefined();
  });

  it('calls onDelete with movie id when delete button clicked', () => {
    const onDelete = jest.fn();
    renderWithProviders(<MovieCard movie={movie} showDeleteIcon onDelete={onDelete} />);
    const btn = screen
      .getAllByRole('button')
      .find((b) => b.getAttribute('aria-label')?.toLowerCase().includes('remover'))!;
    fireEvent.click(btn);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('toggles favorite state on button click', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    const addBtn = screen
      .getAllByRole('button')
      .find((b) => b.getAttribute('aria-label')?.toLowerCase().includes('adicionar'))!;
    expect(addBtn).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(addBtn);
    const removeBtn = screen
      .getAllByRole('button')
      .find((b) => b.getAttribute('aria-label')?.toLowerCase().includes('remover'))!;
    expect(removeBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('highlights matching text when highlight prop provided', () => {
    renderWithProviders(<MovieCard movie={movie} highlight="Inception" />);
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });

  it('renders poster image with alt text', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    expect(screen.getByAltText('Poster de Inception')).toBeInTheDocument();
  });
});
