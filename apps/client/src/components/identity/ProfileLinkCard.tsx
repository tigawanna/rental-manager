import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";
import { RoleIcons } from "./RoleIcons";
import { TRoles } from "@/data-access-layer/users/viewer";

interface ProfileLinkCardProps {
  viewer: {
    id: string;
    image?: string | null;
    name: string;
    email: string;
    role?: TRoles;
  };
}

export function ProfileLinkCard({ viewer }: ProfileLinkCardProps) {
  const avatarUrl = viewer?.image || "/blank-user.png";
  return (
    <Link
      to="/profile"
      data-test="homepage-section--profile-link"
      className="group flex items-center justify-center gap-2 hover:brightness-125">
      <Avatar>
        <AvatarImage height={50} className="size-10" src={avatarUrl} alt={viewer?.name} />
        <AvatarFallback>{viewer?.name?.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex items-center justify-center gap-10">
        <span className="text-2xl">{viewer?.name}</span>
        {viewer?.role && <RoleIcons role={viewer.role} />}
      </div>

      <ArrowRightIcon className="size-10 group-hover:animate-ping group-hover:text-secondary" />
    </Link>
  );
}
