// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN ENTITY: MovieDetails
//
// SOLID — LSP: substitui Movie sem quebrar contratos.
// OCP: enriquece Movie sem modificar a entidade base.
// ─────────────────────────────────────────────────────────────────────────────

import { Movie, MovieProps } from './Movie';

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logoUrl: string | null;
  originCountry: string;
}

export interface SpokenLanguage {
  englishName: string;
  isoCode: string;
  name: string;
}

export interface MovieDetailsProps extends MovieProps {
  genres: Genre[];
  runtime: number | null;
  runtimeFormatted: string | null;
  status: string;
  tagline: string | null;
  budget: number;
  revenue: number;
  homepage: string | null;
  imdbId: string | null;
  productionCompanies: ProductionCompany[];
  spokenLanguages: SpokenLanguage[];
}

export class MovieDetails extends Movie {
  readonly genres: Genre[];
  readonly runtime: number | null;
  readonly runtimeFormatted: string | null;
  readonly status: string;
  readonly tagline: string | null;
  readonly budget: number;
  readonly revenue: number;
  readonly homepage: string | null;
  readonly imdbId: string | null;
  readonly productionCompanies: ProductionCompany[];
  readonly spokenLanguages: SpokenLanguage[];

  constructor(props: MovieDetailsProps) {
    super(props);
    this.genres             = props.genres;
    this.runtime            = props.runtime;
    this.runtimeFormatted   = props.runtimeFormatted;
    this.status             = props.status;
    this.tagline            = props.tagline;
    this.budget             = props.budget;
    this.revenue            = props.revenue;
    this.homepage           = props.homepage;
    this.imdbId             = props.imdbId;
    this.productionCompanies = props.productionCompanies;
    this.spokenLanguages    = props.spokenLanguages;
  }

  // ─── Domain business rules ──────────────────────────────────────────────

  /** Filme tem lucro? */
  isProfitable(): boolean {
    return this.budget > 0 && this.revenue > this.budget;
  }

  /** Retorno sobre investimento */
  roi(): number | null {
    if (!this.budget || this.budget === 0) return null;
    return ((this.revenue - this.budget) / this.budget) * 100;
  }

  /** Tem informação de elenco/produção suficiente para exibir? */
  hasFullDetails(): boolean {
    return this.genres.length > 0 && !!this.overview;
  }
}
