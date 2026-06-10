import React from 'react';
import { render, screen } from '@testing-library/react';
import { RatingBadge } from '@/shared/components/ui/RatingBadge';

describe('RatingBadge', () => {
  it('renders the formatted rating', () => {
    render(<RatingBadge rating={7.5} />);
    expect(screen.getByText('7.5')).toBeInTheDocument();
  });

  it('formats integer ratings with one decimal', () => {
    render(<RatingBadge rating={8} />);
    expect(screen.getByText('8.0')).toBeInTheDocument();
  });

  it('has accessible aria-label', () => {
    render(<RatingBadge rating={7.5} />);
    expect(screen.getByLabelText('Nota: 7.5')).toBeInTheDocument();
  });

  it('applies sm size classes by default', () => {
    const { container } = render(<RatingBadge rating={7.0} />);
    expect(container.firstChild).toHaveClass('text-xs');
  });

  it('applies lg size classes when size="lg"', () => {
    const { container } = render(<RatingBadge rating={7.0} size="lg" />);
    expect(container.firstChild).toHaveClass('text-base');
  });

  it('applies green bg for excellent rating', () => {
    const { container } = render(<RatingBadge rating={8.0} />);
    expect(container.firstChild).toHaveClass('bg-rating-excellent');
  });

  it('applies amber bg for good rating', () => {
    const { container } = render(<RatingBadge rating={6.5} />);
    expect(container.firstChild).toHaveClass('bg-rating-good');
  });

  it('applies red bg for average rating', () => {
    const { container } = render(<RatingBadge rating={4.0} />);
    expect(container.firstChild).toHaveClass('bg-rating-average');
  });

  it('applies custom className', () => {
    const { container } = render(<RatingBadge rating={7.0} className="my-custom" />);
    expect(container.firstChild).toHaveClass('my-custom');
  });
});
