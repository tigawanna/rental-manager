import { treaty } from "@elysiajs/eden";
import type { App } from "../../../../api/src/index";

// Create type-safe Eden Treaty client
// @ts-ignore - TypeScript version mismatch between API and client
export const api = treaty<App>("localhost:5000");

// Export typed API methods for convenience
export const edenApi = {
  actors: {
    list: (params?: { limit?: number; cursor?: string }) =>
      api.api.actors.get({ query: params }),
    get: (id: number) => api.api.actors({ id }).get(),
    create: (data: any) => api.api.actors.post(data),
    update: (id: number, data: any) => api.api.actors({ id }).put(data),
    delete: (id: number) => api.api.actors({ id }).delete(),
  },

  films: {
    list: (params?: { limit?: number; cursor?: string }) =>
      api.api.films.get({ query: params }),
    get: (id: number) => api.api.films({ id }).get(),
    create: (data: any) => api.api.films.post(data),
    update: (id: number, data: any) => api.api.films({ id }).put(data),
    delete: (id: number) => api.api.films({ id }).delete(),
  },

  categories: {
    list: (params?: { limit?: number; cursor?: string }) =>
      api.api.categories.get({ query: params }),
    get: (id: number) => api.api.categories({ id }).get(),
    create: (data: any) => api.api.categories.post(data),
    update: (id: number, data: any) => api.api.categories({ id }).put(data),
    delete: (id: number) => api.api.categories({ id }).delete(),
  },

  languages: {
    list: (params?: { limit?: number; cursor?: string }) =>
      api.api.languages.get({ query: params }),
    get: (id: number) => api.api.languages({ id }).get(),
    create: (data: any) => api.api.languages.post(data),
    update: (id: number, data: any) => api.api.languages({ id }).put(data),
    delete: (id: number) => api.api.languages({ id }).delete(),
  },

  filmActors: {
    list: (params?: { limit?: number; cursor?: string }) =>
      api.api["film-actors"].get({ query: params }),
    byFilm: (filmId: number) =>
      api.api["film-actors"]["by-film"]({ filmId }).get(),
    byActor: (actorId: number) =>
      api.api["film-actors"]["by-actor"]({ actorId }).get(),
    create: (data: any) => api.api["film-actors"].post(data),
  },

  filmCategories: {
    list: (params?: { limit?: number; cursor?: string }) =>
      api.api["film-categories"].get({ query: params }),
    byFilm: (filmId: number) =>
      api.api["film-categories"]["by-film"]({ filmId }).get(),
    byCategory: (categoryId: number) =>
      api.api["film-categories"]["by-category"]({ categoryId }).get(),
    create: (data: any) => api.api["film-categories"].post(data),
  },
};
