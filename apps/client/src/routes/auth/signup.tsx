import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { SignupComponent } from "./-components/SignupComponent";
import { z } from "zod";
import { MapPinHouse } from "lucide-react";
import { ResponsiveGenericToolbar } from "@/components/navigation/ResponsiveGenericToolbar";
import { Helmet } from "@/components/wrappers/custom-helmet";

const searchparams = z.object({
  returnTo: z.string(),
});
export const Route = createFileRoute("/auth/signup")({
  component: SignupPage,
  validateSearch: (search) => searchparams.parse(search),
});

interface SignupProps {}

export function SignupPage({}: SignupProps) {
  return (
    <div className="to-primary/50items-center flex h-full min-h-screen w-full flex-col justify-center ">
      <ResponsiveGenericToolbar>
        <Helmet title="Property | Signup" description="Create a new account" />
        <SignupComponent />
      </ResponsiveGenericToolbar>
    </div>
  );
}
