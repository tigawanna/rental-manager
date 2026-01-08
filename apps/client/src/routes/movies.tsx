import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "@tanstack/react-db";
import { filmsCollection } from "@/integrations/tanstack-db/collections/films";

export const Route = createFileRoute("/movies")({ component: Movies });

function Movies() {
  const { data: films, isLoading } = useLiveQuery((q) =>
    q.from({ film: filmsCollection }).select((row) => row.film),
  );

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Movies</h1>
        <p className="text-muted-foreground mb-6">
          Explore our catalog of {films?.length || "..."} films. All data is
          cached locally for instant access and offline viewing.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {!isLoading && (
        <>
          {!films || films.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No movies found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {films.map((film: any) => (
                <Link
                  key={film.filmId}
                  to="/movies/$filmId"
                  params={{ filmId: film.filmId.toString() }}
                  className="bg-card text-card-foreground rounded-lg shadow-md p-6 hover:shadow-lg transition-all border border-border hover:border-primary cursor-pointer block"
                >
                  <h3 className="text-xl font-semibold mb-2 line-clamp-1">
                    {film.title}
                  </h3>

                  {film.releaseYear && (
                    <p className="text-sm text-muted-foreground mb-2">
                      Released: {film.releaseYear}
                    </p>
                  )}

                  {film.description && (
                    <p className="text-sm text-foreground/80 mb-3 line-clamp-3">
                      {film.description}
                    </p>
                  )}

                  <div className="flex gap-2 flex-wrap mt-3">
                    {film.rating && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {film.rating}
                      </span>
                    )}
                    {film.length && (
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                        {film.length} min
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex justify-between text-xs text-muted-foreground">
                    <span>Rental: ${film.rentalRate}</span>
                    <span>{film.rentalDuration} days</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {!isLoading && films && films.length > 0 && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {films.length} film{films.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
