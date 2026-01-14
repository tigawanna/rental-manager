import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { adminUsersCollection } from "@/data-access-layer/collections/admin/users-collection";
import { eq } from "@tanstack/db";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminUserForm } from "./-components/AdminUserForm";

export const Route = createFileRoute("/dashboard/admin/users/$userid")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userid } = Route.useParams();
  const navigate = useNavigate({ from: "/dashboard/admin/users/$userid" });

  // Query for the specific user
  const query = useLiveQuery(
    (q) =>
      q
        .from({ users: adminUsersCollection })
        .where(({ users }) => eq(users.id, userid))
        .select(({ users }) => ({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          banned: users.banned,
          banReason: users.banReason,
          emailVerified: users.emailVerified,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })),
    [userid],
  );

  const user = query.data?.[0];

  // Transform the user data to match UserWithRole type expectations
  const userData = user ? {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    banned: user.banned,
    banReason: user.banReason,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } : null;

  return (
    <div className="mx-auto min-h-screen min-w-[90%] space-y-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Edit User</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Update user information and settings
          </p>
        </div>
      </div>

      {query.isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ) : !user ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">User not found</p>
          </CardContent>
        </Card>
      ) : (
        <AdminUserForm
          mode="edit"
          user={userData}
          onSuccess={() => {
            navigate({ to: "/dashboard/admin/users" });
          }}
        />
      )}
    </div>
  );
}
