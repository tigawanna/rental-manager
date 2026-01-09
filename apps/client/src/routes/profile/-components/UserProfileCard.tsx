import { RoleIcons } from "@/components/identity/RoleIcons";
import type { TRoles } from "@/data-access-layer/users/viewer";
import { Calendar, Mail, User } from "lucide-react";

interface UserProfileCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    role?: TRoles;
  };
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex flex-col items-center gap-4">
          {/* Avatar */}
          <div className="avatar">
            <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {user.image ? (
                <img src={user.image} alt={user.name} />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary text-primary-content">
                  <User className="size-16" />
                </div>
              )}
            </div>
          </div>

          {/* Name and Role */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-base-content">{user.name}</h2>
            {user.role && (
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="badge badge-primary badge-lg capitalize">{user.role}</span>
                <RoleIcons role={user.role} />
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="divider" />

          {/* Info Grid */}
          <div className="w-full space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-base-content/60">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              {user.emailVerified && (
                <span className="badge badge-success badge-sm">Verified</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="size-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-base-content/60">Member Since</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
