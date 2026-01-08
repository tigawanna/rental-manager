// API configuration for TanStack DB

export const API_CONFIG = {
  baseURL: "http://localhost:5000/api",
  endpoints: {
    actors: "/actors",
    films: "/films",
    categories: "/categories",
    languages: "/languages",
    filmActors: "/film-actors",
    filmCategories: "/film-categories",
  },
} as const;

// Default pagination settings
export const PAGINATION_DEFAULTS = {
  limit: 50,
  maxLimit: 100,
} as const;

// IndexedDB configuration
export const INDEXED_DB_CONFIG = {
  name: "movie-rentals-db",
  version: 1,
} as const;
