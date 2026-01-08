import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "@tanstack/react-db";
import { actorsCollection } from "@/integrations/tanstack-db/collections/actors";


export const Route = createFileRoute("/actors")({ component: Actors });

function Actors() {
  const { data: actors, isLoading } = useLiveQuery((q) =>
    q.from({ actor: actorsCollection }).select((row) => row.actor),
  );

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Actors</h1>
        <p className="text-muted-foreground mb-6">
          Browse our collection of {actors?.length || "..."} talented actors.
          Data is synced in real-time and available offline.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {!isLoading && (
        <>
          {!actors || actors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No actors found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {actors.map((actor: any) => (
                <Link
                  key={actor.actorId}
                  to="/actors/$actorId"
                  params={{ actorId: actor.actorId.toString() }}
                  className="bg-card text-card-foreground rounded-lg shadow-md p-6 hover:shadow-lg transition-all border border-border hover:border-primary cursor-pointer block"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {actor.firstName} {actor.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Actor ID: {actor.actorId}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-2">
                    Last updated:{" "}
                    {new Date(actor.lastUpdate).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {!isLoading && actors && actors.length > 0 && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {actors.length} actor{actors.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
