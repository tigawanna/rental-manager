import { formOptions, useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TextFormField } from "@/lib/tanstack/form/TextFields";
import { MutationButton } from "@/lib/tanstack/query/MutationButton";
import { useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { authClient } from "@/lib/better-auth/client";
import { viewerqueryOptions } from "@/data-access-layer/users/viewer";
import { toast } from "sonner";

interface SignupComponentProps {}

type PropertyUserCreate={
  name: string;
  email: string;
  password: string;
  image: string | undefined;
}

const formOpts = formOptions({
  defaultValues: {
    name: "",
    email: "",
    password: "",
    image: null,
  },
});

export function SignupComponent({}: SignupComponentProps) {
  const { returnTo } = useSearch({
    from: "/auth/signup",
  });
  const [showPassword, setShowPassword] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate({ from: "/auth/signup" });
  const mutation = useMutation({
    mutationFn: (data: PropertyUserCreate) => {
      return authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        image: data.image,
      })
    
    },
    onSuccess(data) {
      toast.success("Signed up",{
        description: `Welcome ${data.data?.user.name}`,
      });
      qc.invalidateQueries(viewerqueryOptions);
      // qc.setQueryData(["viewer"], () => data);
      navigate({ to: "/auth", search: { returnTo: "/profile" } });
      // if (typeof window !== "undefined") {
      //   location.reload();
      // }
    },
    onError(error) {
      toast.error("Something went wrong",{
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
      <img
        src="/site.svg"
        alt="logo"
        className="hidden w-[30%] object-cover md:flex"
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="rounded-lh flex h-full w-[90%] flex-col items-center justify-center gap-6 bg-base-300/20 p-[2%] md:w-[70%] lg:w-[40%]"
      >
        <div className="gap- flex h-full w-full flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">Sign up</h1>
          <form.Field
            name="name"
            validators={{
              onChange: z.string(),
            }}
            children={(field) => {
              return (
                <TextFormField<PropertyUserCreate>
                  field={field}
                  fieldKey="username"
                  inputOptions={{
                    onBlur: field.handleBlur,
                    onChange: (e) => {
                      field.handleChange(e.target.value)
                    },
                  }}
                />
              );
            }}
          />
          <form.Field
            name="email"
            validators={{
              onChange: z.email(),
            }}
            children={(field) => {
              return (
                <TextFormField<PropertyUserCreate>
                  field={field}
                  fieldKey="email"
                  inputOptions={{
                    autoComplete: "email",
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
                <TextFormField<PropertyUserCreate>
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
          <form.Field
            name="passwordConfirm"
            validators={{
              onChange: z.string().min(8),
            }}
            children={(field) => {
              return (
                <TextFormField<PropertyUserCreate>
                  field={field}
                  fieldKey="passwordConfirm"
                  fieldlabel="Confirm password"
                  inputOptions={{
                    type: showPassword ? "text" : "password",
                    onBlur: field.handleBlur,
                    onChange: (e) => field.handleChange(e.target.value),
                  }}
                />
              );
            }}
          />
          <div className="w-full p-5">
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
        <MutationButton className="btn-primary" mutation={mutation} />
        <div className="flex gap-2">
          Already have an account?
          <Link to="/auth" search={{ returnTo }} className="text-primary">
            Sign in
          </Link>
          instead
        </div>
      </form>
    </div>
  );
}
