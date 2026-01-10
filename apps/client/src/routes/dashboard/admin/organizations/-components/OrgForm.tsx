import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import { useAppForm } from "@/lib/tanstack/form";
import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

type CreateOrgForm = {
  name: string;
  slug: string;
  logo?: string;
  metadata?: string;
  keepCurrentActiveOrganization: boolean;
};

const formOpts = formOptions({
  defaultValues: {
    name: "",
    slug: "",
    logo: "",
    metadata: "",
    keepCurrentActiveOrganization: true,
  } satisfies CreateOrgForm,
});

export function OrgForm({
  initialValues,
  onSubmit,
  submitLabel = "Save",
  onCancel,
}: {
  initialValues?: Partial<CreateOrgForm>;
  onSubmit: (payload: {
    name: string;
    slug: string;
    logo?: string;
    metadata?: any;
    userId?: string;
    keepCurrentActiveOrganization: boolean;
  }) => Promise<any>;
  submitLabel?: string;
  onCancel?: () => void;
}) {
  const mergedDefaults = {
    name: "",
    slug: "",
    logo: "",
    metadata: "",
    userId: "",
    keepCurrentActiveOrganization: true,
    ...(initialValues ?? {}),
  } as CreateOrgForm;

  const form = useAppForm({
    ...formOpts,
    defaultValues: mergedDefaults,
    onSubmit: async ({ value }) => {
      const schema = z.object({
        name: z.string().min(1, "Name is required"),
        slug: z.string().min(1, "Slug is required"),
        logo: z.string().optional(),
        metadata: z.string().optional(),
        userId: z.string().optional(),
        keepCurrentActiveOrganization: z.boolean(),
      });

      const result = schema.safeParse(value);
      if (!result.success) {
        toast.error("Validation error", {
          description: result.error.issues.map((i) => i.message).join(", "),
        });
        return;
      }

      let metaObj: any = undefined;
      if (value.metadata && value.metadata.trim()) {
        try {
          metaObj = JSON.parse(value.metadata);
        } catch (err) {
          toast.error("Metadata must be valid JSON");
          return;
        }
      }

      await onSubmit({
        name: value.name.trim(),
        slug: value.slug.trim(),
        logo: value.logo?.trim() || undefined,
        metadata: metaObj,
        keepCurrentActiveOrganization: value.keepCurrentActiveOrganization,
      });

      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4">
      <form.AppField name="name" validators={{ onChange: z.string().min(1, "Name is required") }}>
        {(f) => <f.TextField label="Organization name" />}
      </form.AppField>

      <form.AppField name="slug" validators={{ onChange: z.string().min(1, "Slug is required") }}>
        {(f) => <f.TextField label="Slug" />}
      </form.AppField>

      <form.AppField
        name="logo"
        validators={{
          onChange: z
            .string()
            .refine((val) => val === "" || z.string().url().safeParse(val).success, {
              message: "Must be a valid URL or empty",
            }),
        }}>
        {(f) => <f.TextField label="Logo URL (optional)" />}
      </form.AppField>

      <form.AppField
        name="metadata"
        validators={{
          onChange: z.string().refine(
            (val) => {
              if (!val || val.trim() === "") return true;
              try {
                JSON.parse(val);
                return true;
              } catch (err) {
                return false;
              }
            },
            { message: "Metadata must be valid JSON or empty" }
          ),
        }}>
        {(f) => <f.TextAreaField label="Metadata (JSON) (optional)" />}
      </form.AppField>

      <form.AppField name="keepCurrentActiveOrganization">
        {(f) => <f.SwitchField label="Keep current active organization" />}
      </form.AppField>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <form.AppForm>
          <form.SubmitButton label={submitLabel} />
        </form.AppForm>
      </div>
    </form>
  );
}
