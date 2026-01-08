import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "@tanstack/react-db";
import { filmsCollection } from "@/integrations/tanstack-db/collections/films";
import { filmActorsCollection } from "@/integrations/tanstack-db/collections/film-actors";
import { actorsCollection } from "@/integrations/tanstack-db/collections/actors";
import { ArrowLeft, Users, DollarSign, Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/movies/$filmId")({
  component: MovieDetail,
});

function MovieDetail() {
  const { filmId } = Route.useParams();
  const filmIdNum = parseInt(filmId, 10);

  const { data: films } = useLiveQuery((q) =>
    q
      .from({ film: filmsCollection })
      .where((row) => row.film.filmId === filmIdNum)
      .select((row) => row.film),
  );

  const { data: filmActors } = useLiveQuery((q) =>
    q
      .from({ fa: filmActorsCollection })
      .where((row) => row.fa.filmId === filmIdNum)
      .select((row) => row.fa),
  );

  const { data: actors } = useLiveQuery((q) =>
    q.from({ actor: actorsCollection }).select((row) => row.actor),
  );

  const film = films?.[0];
  const filmActorsList = actors?.filter((actor) =>
    filmActors?.some((fa) => fa.actorId === actor.actorId),
  );

  if (!film) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Movie not found</p>
          <Link
            to="/movies"
            className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <Link
        to="/movies"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Movies
      </Link>

      <div className="bg-card text-card-foreground rounded-lg shadow-lg p-8 border border-border mb-8">
        <h1 className="text-4xl font-bold mb-4">{film.title}</h1>

        <div className="flex gap-2 flex-wrap mb-6">
          {film.rating && (
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-md font-medium">
              {film.rating}
            </span>
          )}
          {film.releaseYear && (
            <span className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-md font-medium flex items-center gap-1">
              <Calendar size={14} />
              {film.releaseYear}
            </span>
          )}
          {film.length && (
            <span className="px-3 py-1 bg-accent text-accent-foreground text-sm rounded-md font-medium flex items-center gap-1">
              <Clock size={14} />
              {film.length} min
            </span>
          )}
        </div>

        {film.description && (
          <p className="text-foreground/90 text-lg mb-6 leading-relaxed">
            {film.description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            <DollarSign size={20} className="text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Rental Rate</p>
              <p className="font-semibold">${film.rentalRate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Rental Duration</p>
              <p className="font-semibold">{film.rentalDuration} days</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={20} className="text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Replacement Cost</p>
              <p className="font-semibold">${film.replacementCost}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Users size={24} />
          Cast ({filmActorsList?.length || 0})
        </h2>
      </div>

      {!filmActorsList || filmActorsList.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border">
          No cast information available
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filmActorsList.map((actor) => (
            <Link
              key={actor.actorId}
              to="/actors/$actorId"
              params={{ actorId: actor.actorId.toString() }}
              className="bg-card text-card-foreground rounded-lg shadow-md p-4 hover:shadow-lg transition-all border border-border hover:border-primary cursor-pointer"
            >
              <p className="font-semibold text-center">
                {actor.firstName} {actor.lastName}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
