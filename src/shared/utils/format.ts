export function formatDate(dateString: string): string {
  if (!dateString) return 'Data desconhecida';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function getRatingColor(rating: number): string {
  if (rating >= 7.5) return 'text-rating-excellent';
  if (rating >= 6) return 'text-rating-good';
  return 'text-rating-average';
}

export function getRatingBgColor(rating: number): string {
  if (rating >= 7.5) return 'bg-rating-excellent';
  if (rating >= 6) return 'bg-rating-good';
  return 'bg-rating-average';
}

export function highlightText(
  text: string,
  highlight: string,
): Array<{ text: string; highlighted: boolean }> {
  if (!highlight.trim()) return [{ text, highlighted: false }];
  const regex = new RegExp(
    `(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi',
  );
  const parts = text.split(regex);
  return parts.map((part) => ({
    text: part,
    highlighted: part.toLowerCase() === highlight.toLowerCase(),
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function clsx(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(' ');
}
