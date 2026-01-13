import { viewerqueryOptions } from "@/data-access-layer/users/viewer";
import { authClient } from "@/lib/better-auth/client";
import { useAppForm } from "@/lib/tanstack/form";
import { formOptions } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

interface EditProfileFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

type UpdateProfileData = {
  name: string;
  image?: string;
};

const formOpts = formOptions({
  defaultValues: {
    name: "",
    image: "",
  } satisfies UpdateProfileData,
});

export function EditProfileForm({ user }: EditProfileFormProps) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      return authClient.updateUser({
        name: data.name,
        image: data.image || undefined,
      });
    },
    onSuccess(data) {
      toast.success("Profile updated successfully");
      qc.invalidateQueries(viewerqueryOptions);
    },
    onError(error) {
      toast.error("Failed to update profile", {
        description: error.message,
      });
    },
  });

  const form = useAppForm({
    ...formOpts,
    defaultValues: {
      name: user.name,
      image: user.image || "",
    },
    onSubmit: async ({ value }) => {
      await mutation.mutate(value);
    },
  });

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Edit Profile</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.AppField
            name="name"
            validators={{
              onChange: z.string().min(1, "Name is required"),
            }}
          >
            {(field) => <field.TextField label="Display Name" />}
          </form.AppField>

          <form.AppField
            name="image"
            validators={{
              onChange: z
                .string()
                .refine((val) => val === "" || z.url().safeParse(val).success, {
                  message: "Must be a valid URL or empty",
                }),
            }}
          >
            {(field) => (
              <field.TextField label="Profile Image URL (optional)" />
            )}
          </form.AppField>

          <form.AppForm>
            <form.SubmitButton
              label={mutation.isPending ? "Updating..." : "Update Profile"}
              className="w-full"
            />
          </form.AppForm>
        </form>
      </div>
    </div>
  );
}
