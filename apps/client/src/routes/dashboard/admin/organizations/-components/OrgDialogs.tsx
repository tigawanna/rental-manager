import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/better-auth/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { OrgForm } from "./OrgForm";

interface CreateOrgProps {
  triggerLabel?: string;
  onCreated?: (org: any) => void;
  className?: string;
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

export function CreateOrg({ triggerLabel = "Create org", onCreated, className }: CreateOrgProps) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (payload: {
      name: string;
      slug: string;
      logo?: string;
      metadata?: any;
      userId?: string;
      keepCurrentActiveOrganization?: boolean;
    }) => {
      const { data, error } = await authClient.organization.create({
        name: payload.name,
        slug: payload.slug,
        logo: payload.logo,
        metadata: payload.metadata,
        userId: payload.userId,
        keepCurrentActiveOrganization: payload.keepCurrentActiveOrganization,
      });
      if (error) throw error;
      return data;
    },
    onSuccess(data) {
      toast.success("Organization created");
      if (onCreated) onCreated(data);
      setOpen(false);
    },
    onError(err: unknown) {
      if (err instanceof Error) {
        toast.error("Failed to create organization", { description: err.message });
      } else {
        toast.error("Failed to create organization", { description: String(err) });
      }
    },
    meta: {
      invalidates: [["organizations"]],
    },
  });

  // prefer typed invalidation call
  const invalidateOrgs = () => qc.invalidateQueries({ queryKey: ['organizations'] })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className={className}>
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
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
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (payload: TOrgPayload) => {
      const { data, error } = await authClient.organization.update({
        data: payload.body,
        organizationId: payload.organizationId,
      });
      if (error) throw error;
      return data;
    },
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
        toast.error("Failed to update organization", { description: err.message });
        return;
      } else {
        toast.error("Failed to update organization", { description: String(err) });
      }
    },
    meta:{
      invalidates: [["organizations"]]
    }
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
        </DialogHeader>

        <OrgForm
          initialValues={{
            name: org?.body.name,
            slug: org?.body.slug,
            logo: org?.body.logo ?? "",
            metadata: org?.body.metadata ? JSON.stringify(org?.body.metadata, null, 2) : "",
            keepCurrentActiveOrganization: true,
          }}
          onSubmit={async (payload) => {
            return mutation.mutateAsync({
              organizationId: org.organizationId,
              body: {
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
