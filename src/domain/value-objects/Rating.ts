// ─────────────────────────────────────────────────────────────────────────────
// VALUE OBJECT: Rating
//
// SOLID — SRP: encapsula todas as regras de negócio relacionadas a nota.
// DIP: componentes dependem deste VO, não de lógica espalhada.
//
// Value Object: imutável, igualdade por valor, não por referência.
// ─────────────────────────────────────────────────────────────────────────────

import { RatingLevel } from '../entities/Movie';

export class Rating {
  private constructor(
    private readonly _value: number,
  ) {}

  static create(value: number): Rating {
    if (value < 0 || value > 10) {
      throw new Error(`Rating must be between 0 and 10. Received: ${value}`);
    }
    return new Rating(value);
  }

  static createSafe(value: number): Rating {
    const clamped = Math.max(0, Math.min(10, value));
    return new Rating(clamped);
  }

  get value(): number {
    return this._value;
  }

  get formatted(): string {
    return this._value.toFixed(1);
  }

  get level(): RatingLevel {
    if (this._value >= 7.5) return 'excellent';
    if (this._value >= 6.0) return 'good';
    return 'average';
  }

  get tailwindTextColor(): string {
    if (this._value >= 7.5) return 'text-rating-excellent';
    if (this._value >= 6.0) return 'text-rating-good';
    return 'text-rating-average';
  }

  get tailwindBgColor(): string {
    if (this._value >= 7.5) return 'bg-rating-excellent';
    if (this._value >= 6.0) return 'bg-rating-good';
    return 'bg-rating-average';
  }

  isExcellent(): boolean { return this._value >= 7.5; }
  isGood():      boolean { return this._value >= 6.0 && this._value < 7.5; }
  isAverage():   boolean { return this._value < 6.0; }

  equals(other: Rating): boolean {
    return this._value === other._value;
  }
}
