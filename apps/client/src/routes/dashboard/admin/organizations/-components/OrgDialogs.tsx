import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createOrganizationMutationOptions,
  updateOrganizationMutationOptions,
} from "@/data-access-layer/users/user-orgs";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { OrgForm } from "./OrgForm";
import { Plus } from "lucide-react";
import { D } from "node_modules/@tanstack/react-query-devtools/build/modern/ReactQueryDevtools-ChNsB-ya";

interface CreateOrgProps {
  onCreated?: (org: any) => void;
  triggerLabel?: string;
}

type TOrgPayload = {
  organizationId: string;
  body: TOrgBodyPayload;
};
type TOrgBodyPayload = {
  name?: string | undefined;
  slug?: string | undefined;
  logo?: string | undefined;
  metadata?: Record<string, any> | undefined;
};

export function CreateOrg({ onCreated, triggerLabel }: CreateOrgProps) {
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: createOrganizationMutationOptions.mutationFn,
    onSuccess(data) {
      toast.success("Organization created");
      if (onCreated) onCreated(data);
      setOpen(false);
    },
    onError(err: unknown) {
      if (err instanceof Error) {
        toast.error("Failed to create organization", {
          description: err.message,
        });
      } else {
        toast.error("Failed to create organization", {
          description: String(err),
        });
      }
    },
    meta: {
      invalidates: [["organizations"]],
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          <Plus className="size-4" />
          {triggerLabel && <div className="ml-2">{triggerLabel}</div>}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2 text-sm">
            Fill out the form below to create a new organization.
          </DialogDescription>
        </DialogHeader>

        <OrgForm
          onSubmit={async (payload) => {
            return mutation.mutateAsync(payload);
          }}
          submitLabel={mutation.isPending ? "Creating..." : "Create"}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export function EditOrg({
  org,
  triggerLabel = "Edit org",
  className,
  onUpdated,
}: {
  org: TOrgPayload;
  triggerLabel?: string;
  className?: string;
  onUpdated?: (org: TOrgPayload) => void;
}) {
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: updateOrganizationMutationOptions.mutationFn,
    onSuccess(data) {
      toast.success("Organization updated");
      if (onUpdated)
        onUpdated({
          organizationId: org.organizationId,
          body: {
            name: data?.name,
            slug: data?.slug,
            logo: data?.logo as string | undefined,
            metadata: data?.metadata,
          },
        });
      setOpen(false);
    },
    onError(err: unknown) {
      if (err instanceof Error) {
        toast.error("Failed to update organization", {
          description: err.message,
        });
        return;
      } else {
        toast.error("Failed to update organization", {
          description: String(err),
        });
      }
    },
    meta: {
      invalidates: [["organizations"]],
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className={className}>
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit organization</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2 text-sm">
            Update the organization details using the form below.
          </DialogDescription>
        </DialogHeader>

        <OrgForm
          initialValues={{
            name: org?.body.name,
            slug: org?.body.slug,
            logo: org?.body.logo ?? "",
            metadata: org?.body.metadata
              ? JSON.stringify(org?.body.metadata, null, 2)
              : "",
            keepCurrentActiveOrganization: true,
          }}
          onSubmit={async (payload) => {
            return mutation.mutateAsync({
              organizationId: org.organizationId,
              data: {
                name: payload.name,
                slug: payload.slug,
                logo: payload.logo,
                metadata: payload.metadata,
              },
            });
          }}
          submitLabel={mutation.isPending ? "Saving..." : "Save"}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
