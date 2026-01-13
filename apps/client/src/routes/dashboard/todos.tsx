import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/todos")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/todos"!</div>;
}
