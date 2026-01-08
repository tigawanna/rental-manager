import { API_CONFIG, PAGINATION_DEFAULTS } from "./config";
import type { PaginatedResponse, PaginationParams } from "./schema";

// Generic fetch function for paginated endpoints
export async function fetchPaginated<T>(
  endpoint: string,
  params: PaginationParams = {},
): Promise<PaginatedResponse<T>> {
  const url = new URL(`${API_CONFIG.baseURL}${endpoint}`);

  if (params.limit) {
    url.searchParams.set("limit", String(params.limit));
  } else {
    url.searchParams.set("limit", String(PAGINATION_DEFAULTS.limit));
  }

  if (params.cursor) {
    url.searchParams.set("cursor", params.cursor);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }

  return response.json();
}

// Fetch functions for each collection
export const api = {
  actors: {
    list: (params?: PaginationParams) =>
      fetchPaginated(API_CONFIG.endpoints.actors, params),
    get: async (id: number) => {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.actors}/${id}`,
      );
      if (!response.ok) throw new Error("Actor not found");
      return response.json();
    },
  },

  films: {
    list: (params?: PaginationParams) =>
      fetchPaginated(API_CONFIG.endpoints.films, params),
    get: async (id: number) => {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.films}/${id}`,
      );
      if (!response.ok) throw new Error("Film not found");
      return response.json();
    },
  },

  categories: {
    list: (params?: PaginationParams) =>
      fetchPaginated(API_CONFIG.endpoints.categories, params),
  },

  languages: {
    list: (params?: PaginationParams) =>
      fetchPaginated(API_CONFIG.endpoints.languages, params),
  },

  filmActors: {
    list: (params?: PaginationParams) =>
      fetchPaginated(API_CONFIG.endpoints.filmActors, params),
    byFilm: async (filmId: number) => {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.filmActors}/by-film/${filmId}`,
      );
      if (!response.ok) throw new Error("Failed to fetch film actors");
      return response.json();
    },
    byActor: async (actorId: number) => {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.filmActors}/by-actor/${actorId}`,
      );
      if (!response.ok) throw new Error("Failed to fetch actor films");
      return response.json();
    },
  },

  filmCategories: {
    list: (params?: PaginationParams) =>
      fetchPaginated(API_CONFIG.endpoints.filmCategories, params),
    byFilm: async (filmId: number) => {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.filmCategories}/by-film/${filmId}`,
      );
      if (!response.ok) throw new Error("Failed to fetch film categories");
      return response.json();
    },
    byCategory: async (categoryId: number) => {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.filmCategories}/by-category/${categoryId}`,
      );
      if (!response.ok) throw new Error("Failed to fetch category films");
      return response.json();
    },
  },
} as const;
