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

  it('renders movie rating badge', () => {
    renderWithProviders(<MovieCard movie={movie} />);
    // RatingBadge renders via aria-label
    expect(screen.getByLabelText('Nota: 8.8')).toBeInTheDocument();
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

  it('favorite button has aria-pressed reflecting favorite state', () => {
    const { container } = renderWithProviders(<MovieCard movie={movie} />);
    // Find button by partial aria-label match using querySelectorAll
    const buttons = Array.from(container.querySelectorAll('button'));
    const addBtn = buttons.find(b => b.getAttribute('aria-label')?.includes('Adicionar')) as HTMLElement;
    expect(addBtn).toBeDefined();
    expect(addBtn).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(addBtn);
    const btnsAfter = Array.from(container.querySelectorAll('button'));
    const removeBtn = btnsAfter.find(b => b.getAttribute('aria-label')?.includes('Remover')) as HTMLElement;
    expect(removeBtn).toBeDefined();
    expect(removeBtn).toHaveAttribute('aria-pressed', 'true');
  });
});
