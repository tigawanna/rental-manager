import { authClient } from "@/lib/better-auth/client";
import { useAppForm } from "@/lib/tanstack/form";
import { formOptions } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Route } from "../index";

interface SigninComponentProps {}

interface PropertyUserLogin {
  email: string;
  password: string;
}

const formOpts = formOptions({
  defaultValues: {
    email: "",
    password: "",
  } satisfies PropertyUserLogin,
});

export function SigninComponent({}: SigninComponentProps) {
  const [showPassword, setShowPassword] = useState(false);
  const qc = useQueryClient();
  const { returnTo } = Route.useSearch();
  const navigate = useNavigate({ from: "/auth" });

  const mutation = useMutation({
    mutationFn: (data: PropertyUserLogin) => {
      return authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: true,
      });
    },
    onSuccess(data) {
      if(data.error){
        toast.error("Something went wrong", {
          description: `${data.error.message}`,
          position:"top-center"
        });
        return;
      }
      toast.success("Signed in", {
        description: `Welcome back ${data.data?.user.name}`,
      });
      qc.setQueryData(["viewer"], () => data);
      navigate({ to: returnTo || "/" });
      if (typeof window !== "undefined") {
        location.reload();
      }
    },
    onError(error) {
      console.log(error.name);
      toast.error("Something went wrong", {
        description: `${error.message}`,
      });
    },
  });

  const form = useAppForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      await mutation.mutate(value as PropertyUserLogin);
    },
  });

  return (
    <div className="flex h-full w-full items-center justify-evenly gap-2 p-5">
      <img src="/logo.svg" alt="logo" className="hidden w-[30%] object-cover md:flex" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="rounded-lg flex h-full w-[90%] flex-col items-center justify-center gap-6 p-[2%] md:w-[70%] lg:w-[40%]">
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold">Sign in</h1>

          <form.AppField
            name="email"
            validators={{
              onChange: z.string().min(1, "Email is required"),
            }}>
            {(field) => <field.TextField label="Email or username" />}
          </form.AppField>

          <form.AppField
            name="password"
            validators={{
              onChange: z.string().min(8, "Password must be at least 8 characters"),
            }}>
            {(field) => <field.PasswordField label="Password" showPassword={showPassword} />}
          </form.AppField>

          <div className="w-full">
            <div className="flex w-full items-center justify-center gap-3">
              <label htmlFor="showPassword" className="text-sm">
                Show password
              </label>
              <input
                type="checkbox"
                id="showPassword"
                name="showPassword"
                className="checkbox-primary checkbox ring-1 ring-primary"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
        </div>

        <form.AppForm>
          <form.SubmitButton label="Sign in" className="w-full" />
        </form.AppForm>

        <div className="flex w-full flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-1">
            <span>Don&apos;t have an account?</span>
            <Link to="/auth/signup" search={{ returnTo }} className="link link-primary">
              Sign up
            </Link>
          </div>
          <div className="flex w-full flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={mutation.isPending}
              className="btn btn-primary btn-sm"
              onClick={() => {
                form.setFieldValue("email", "stranger1@email.com");
                form.setFieldValue("password", "stranger1@email.com");
              }}>
              Login as stranger 1
            </button>
            <button
              type="button"
              disabled={mutation.isPending}
              className="btn btn-secondary btn-sm"
              onClick={() => {
                form.setFieldValue("email", "stranger2@email.com");
                form.setFieldValue("password", "stranger2@email.com");
              }}>
              Login as stranger 2
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
