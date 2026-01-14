import { AdminUsersPage } from "@/routes/dashboard/admin/users/-components/AdminUsersPage";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/dashboard/admin/users/")({
  component: RouteComponent,
  validateSearch: z.object({
    sq: z.string().optional().catch(undefined),
    sortBy: z.string().optional(),
    sortDirection: z.enum(["asc", "desc"]).optional(),
  }),
});

function RouteComponent() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <AdminUsersPage />
    </div>
  );
}
