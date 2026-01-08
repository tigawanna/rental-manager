import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen w-full h-full flex justify-center items-center bg-base-100">
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-4xl font-bold mb-4">Dashboard Home</h1>
        <Link to="/" className="btn">
          <ChevronLeft /> Go to home
        </Link>
      </div>
    </div>
  );
}
