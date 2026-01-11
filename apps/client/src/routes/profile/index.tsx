import { ResponsiveGenericToolbar } from "@/components/navigation/ResponsiveGenericToolbar";
import { Helmet } from "@/components/wrappers/custom-helmet";
import { useViewer } from "@/data-access-layer/users/viewer";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Footer } from "react-day-picker";
import { AccountActions } from "./-components/AccountActions";
import { ChangePasswordForm } from "./-components/ChangePasswordForm";
import { EditProfileForm } from "./-components/EditProfileForm";
import { UserProfileCard } from "./-components/UserProfileCard";
import { BetterAuthUserRoles } from "@/lib/better-auth/client";


export const Route = createFileRoute("/profile/")({
  component: RouteComponent,
  beforeLoad: async (context) => {
    if (!context.context.viewer?.user) {
      throw redirect({
        to: "/auth",
        search: {
          returnTo: context.location.pathname,
        },
      });
    }
  },
});

function RouteComponent() {
  const { viewer } = useViewer();

  if (!viewer.user) {
    return null;
  }

  return (
    <div className="flex h-full min-h-screen w-full flex-col bg-base-100">
      <Helmet title="Profile" description="Manage your profile settings" />
      <ResponsiveGenericToolbar>
        <div className="container mx-auto p-5">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-base-content">Profile Settings</h1>
            <p className="text-base-content/70 mt-2">
              Manage your account information and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <UserProfileCard
                user={{
                  ...viewer.user,
                  role: viewer.user?.role as BetterAuthUserRoles,
                }}
              />
            </div>

            {/* Right Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              <EditProfileForm user={viewer.user} />
              <ChangePasswordForm />
              <AccountActions />
            </div>
          </div>
        </div>
        <Footer />
      </ResponsiveGenericToolbar>
    </div>
  );
}

