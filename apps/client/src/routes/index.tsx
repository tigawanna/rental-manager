import { ResponsiveGenericToolbar } from "@/components/navigation/ResponsiveGenericToolbar";
import { Helmet } from "@/components/wrappers/custom-helmet";
import { useViewer } from "@/data-access-layer/users/viewer";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRightIcon, Building2, DollarSign, User, UserCog, Users } from "lucide-react";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const { viewer } = useViewer();
  return (
    <div
      data-test="homepage"
      className="flex h-full min-h-screen w-full flex-col items-center bg-base-100">
      <Helmet title="My property manager" description="Welcome to your property manager" />

      <ResponsiveGenericToolbar>
        <div className="flex h-full w-full flex-col items-center justify-center gap-10 p-5">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1
              data-test="homepage-section-welcome"
              className="text-5xl font-bold text-base-content md:text-6xl">
              Welcome Back{viewer.user?.name ? `, ${viewer.user.name}` : ""}
            </h1>
            <p className="text-lg text-base-content/70">
              Manage your properties, tenants, and rentals all in one place
            </p>
          </div>

          <div className="flex flex-wrap gap-4 w-full max-w-2xl justify-center">
            <Link
              to="/dashboard"
              data-test="homepage-section--dashboard-link"
              className="btn btn-primary btn-lg gap-2">
              <span>Dashboard</span>
              <ArrowRightIcon className="size-6" />
            </Link>
            <Link to="/profile" className="btn btn-outline btn-lg gap-2">
              <User className="size-5" />
              <span>Profile</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mt-10">
            <Link
              to="/dashboard/units"
              className="card bg-base-200 hover:bg-base-300 shadow-lg transition-all hover:scale-105">
              <div className="card-body items-center text-center">
                <Building2 className="size-12 text-primary mb-2" />
                <h3 className="card-title text-lg">Units</h3>
                <p className="text-sm text-base-content/70">
                  View and manage rental units
                </p>
              </div>
            </Link>
            <Link
              to="/dashboard/tenants"
              className="card bg-base-200 hover:bg-base-300 shadow-lg transition-all hover:scale-105">
              <div className="card-body items-center text-center">
                <Users className="size-12 text-primary mb-2" />
                <h3 className="card-title text-lg">Tenants</h3>
                <p className="text-sm text-base-content/70">
                  View tenant details and lease agreements
                </p>
              </div>
            </Link>
            <Link
              to="/dashboard/payments"
              className="card bg-base-200 hover:bg-base-300 shadow-lg transition-all hover:scale-105">
              <div className="card-body items-center text-center">
                <DollarSign className="size-12 text-primary mb-2" />
                <h3 className="card-title text-lg">Payments</h3>
                <p className="text-sm text-base-content/70">
                  Track rent payments and billing history
                </p>
              </div>
            </Link>
            <Link
              to="/dashboard/staff"
              className="card bg-base-200 hover:bg-base-300 shadow-lg transition-all hover:scale-105">
              <div className="card-body items-center text-center">
                <UserCog className="size-12 text-primary mb-2" />
                <h3 className="card-title text-lg">Staff</h3>
                <p className="text-sm text-base-content/70">
                  Manage staff accounts and permissions
                </p>
              </div>
            </Link>
          </div>
        </div>
      </ResponsiveGenericToolbar>
    </div>
  );
}
