import { useNavigate } from "@tanstack/react-router";
import { Route } from "../index";
import { formOptions, useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TextFormField } from "@/lib/tanstack/form/TextFields";
import { MutationButton } from "@/lib/tanstack/query/MutationButton";
import { useState } from "react";
import { authClient } from "@/lib/better-auth/client";
import { toast } from "sonner";

interface SigninComponentProps {}

interface PropertyUserLogn {
  email: string;
  password: string;
}

const formOpts = formOptions({
  defaultValues: {
    email: "",
    password: "",
  },
});
export function SigninComponent({}: SigninComponentProps) {
  const [showPassword, setShowPassword] = useState(false);
  const qc = useQueryClient();
  const { returnTo } = Route.useSearch();
  const navigate = useNavigate({ from: "/auth" });

  const mutation = useMutation({
    mutationFn: (data: PropertyUserLogn) => {
      return authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: true,
      });
    },
    onSuccess(data) {
      toast.success("Signed in", {
        description: `Welcome back ${data.data?.user.name}`,
      });
      // qc.invalidateQueries(viewerqueryOptions);
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
  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      await mutation.mutate(value);
    },
  });
  return (
    <div className="flex h-full w-full items-center justify-evenly gap-2 p-5">
      <img src="/site.svg" alt="logo" className="hidden w-[30%] object-cover md:flex" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="rounded-lg flex h-full w-[90%] flex-col items-center justify-center gap-6 p-[2%] md:w-[70%] lg:w-[40%]">
        <div className=" flex  w-full  flex-col items-center justify-center gap-2">
          <h1 className="text-4xl font-bold">Sign in</h1>
          <form.Field
            name="email"
            validators={{
              onChange: z.string(),
            }}
            children={(field) => {
              return (
                <TextFormField<PropertyUserLogn>
                  field={field}
                  fieldKey="email"
                  fieldlabel="email or username"
                  inputOptions={{
                    onBlur: field.handleBlur,
                    onChange: (e) => field.handleChange(e.target.value),
                  }}
                />
              );
            }}
          />

          <form.Field
            name="password"
            validators={{
              onChange: z.string().min(8),
            }}
            children={(field) => {
              return (
                <TextFormField<PropertyUserLogn>
                  field={field}
                  fieldKey="password"
                  inputOptions={{
                    type: showPassword ? "text" : "password",
                    onBlur: field.handleBlur,
                    onChange: (e) => field.handleChange(e.target.value),
                  }}
                />
              );
            }}
          />

          <div className="w-full pt-5">
            <div className="flex w-full items-center justify-center gap-3">
              <label htmlFor="showPassword" className="text-sm">
                Show password
              </label>
              <input
                type="checkbox"
                id="showPassword"
                name="showPassword"
                className="checkbox-primary checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
        </div>
        <MutationButton label="Sign in" className="btn btn-primary" mutation={mutation} />
        <div className="flex flex-col items-center justify-center gap-2">
          Don&apos;t have an account?
          <div className="flex gap-2">
            <button
              disabled={mutation.isPending}
              className="btn btn-primary btn-sm"
              onClick={() => {
                form.setFieldValue("email", "stranger1@email.com");
                form.setFieldValue("password", "stranger1@email.com");
              }}>
              Login as stranger 1
            </button>
            <button
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
