import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "@tanstack/react-db";
import { actorsCollection } from "@/integrations/tanstack-db/collections/actors";
import { filmActorsCollection } from "@/integrations/tanstack-db/collections/film-actors";
import { filmsCollection } from "@/integrations/tanstack-db/collections/films";
import { ArrowLeft, Film } from "lucide-react";

export const Route = createFileRoute("/actors/$actorId")({
  component: ActorDetail,
});

function ActorDetail() {
  const { actorId } = Route.useParams();
  const actorIdNum = parseInt(actorId, 10);
  const { data: actors } = useLiveQuery((q) =>
    q
      .from({ actor: actorsCollection })
      .where((row) => row.actor.actorId === actorIdNum)
      .select((row) => row.actor),
  );

  const { data: filmActors } = useLiveQuery((q) =>
    q
      .from({ fa: filmActorsCollection })
      .where((row) => row.fa.actorId === actorIdNum)
      .select((row) => row.fa),
  );

  const { data: films } = useLiveQuery((q) =>
    q.from({ film: filmsCollection }).select((row) => row.film),
  );

  const actor = actors?.[0];
  const actorFilms = films?.filter((film) =>
    filmActors?.some((fa) => fa.filmId === film.filmId),
  );

  if (!actor) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Actor not found</p>
          <Link
            to="/actors"
            className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Actors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <Link
        to="/actors"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Actors
      </Link>

      <div className="bg-card text-card-foreground rounded-lg shadow-lg p-8 border border-border mb-8">
        <h1 className="text-4xl font-bold mb-4">
          {actor.firstName} {actor.lastName}
        </h1>
        <div className="flex flex-col gap-2 text-muted-foreground">
          <p>Actor ID: {actor.actorId}</p>
          <p>Last updated: {new Date(actor.lastUpdate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Film size={24} />
          Films ({actorFilms?.length || 0})
        </h2>
      </div>

      {!actorFilms || actorFilms.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border">
          No films found for this actor
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actorFilms.map((film) => (
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
                <p className="text-sm text-foreground/80 mb-3 line-clamp-2">
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
