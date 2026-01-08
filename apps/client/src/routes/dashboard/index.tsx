import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="content min-h-screen w-full bg-base-100">
      Hello "/dashboard/"!
      <Link to="/" className="btn">
        <ChevronLeft /> Go to home
      </Link>
    </div>
  );
}
