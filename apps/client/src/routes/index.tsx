import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background via-muted to-background flex items-center justify-center">
      <h1 className="text-6xl font-bold text-foreground">Home Page</h1>
    </div>
  );
}
