import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  user: ["create", "list", "set-role", "ban", "delete"],
  session: ["list", "revoke"],
  property: ["create", "read", "update", "delete", "list"],
  tenant: ["create", "read", "update", "delete", "list"],
  lease: ["create", "read", "update", "delete", "list"],
  maintenance: ["create", "read", "update", "delete", "list", "assign"],
  payment: ["create", "read", "update", "list"],
  document: ["create", "read", "delete", "list"],
} as const;

const ac = createAccessControl(statement);

export const roles = {
  admin: ac.newRole({
    user: ["create", "list", "set-role", "ban", "delete"],
    session: ["list", "revoke"],
    property: ["create", "read", "update", "delete", "list"],
    tenant: ["create", "read", "update", "delete", "list"],
    lease: ["create", "read", "update", "delete", "list"],
    maintenance: ["create", "read", "update", "delete", "list", "assign"],
    payment: ["create", "read", "update", "list"],
    document: ["create", "read", "delete", "list"],
  }),
  landlord: ac.newRole({
    property: ["create", "read", "update", "delete", "list"],
    tenant: ["create", "read", "update", "list"],
    lease: ["create", "read", "update", "list"],
    maintenance: ["create", "read", "update", "list", "assign"],
    payment: ["read", "list"],
    document: ["create", "read", "delete", "list"],
    session: ["list"],
  }),
  manager: ac.newRole({
    property: ["read", "update", "list"],
    tenant: ["create", "read", "update", "list"],
    lease: ["create", "read", "update", "list"],
    maintenance: ["create", "read", "update", "list", "assign"],
    payment: ["read", "list"],
    document: ["create", "read", "list"],
    session: ["list"],
  }),
  staff: ac.newRole({
    property: ["read", "list"],
    tenant: ["read", "list"],
    lease: ["read", "list"],
    maintenance: ["create", "read", "update", "list"],
    payment: ["read", "list"],
    document: ["create", "read", "list"],
    session: ["list"],
  }),
  tenant: ac.newRole({
    property: ["read"],
    tenant: ["read"],
    lease: ["read"],
    maintenance: ["create", "read"],
    payment: ["read", "list"],
    document: ["read", "list"],
    session: ["list"],
  }),
};

export { ac };
