import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  user: ["create", "list", "set-role", "ban", "delete"],
  session: ["list", "revoke"],
} as const;

const ac = createAccessControl(statement);

export const roles = {
  admin: ac.newRole({
    user: ["create", "list", "set-role", "ban", "delete"],
    session: ["list", "revoke"],
  }),
  user: ac.newRole({
    session: ["list"],
  }),
};

export { ac };
