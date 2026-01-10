import { db } from "@/db/client";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI, organization, apiKey, bearer } from "better-auth/plugins";
import { ac, roles } from "./auth-rbac";
import { AUTHORIZED_ORIGINS } from "@/utils/constants";


export const auth = betterAuth({
  trustedOrigins:AUTHORIZED_ORIGINS,
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  plugins: [
    apiKey(),
    bearer(),
    openAPI(),
    admin({
      ac,
      roles,
    }),
    organization(),
  ],
});


let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const BetterAuthOpenAPI = {
  getPaths: (prefix = "/api/auth") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        reference[key] = paths[path];

        for (const method of Object.keys(paths[path])) {
          // ignore the as any type cast below it is very intentional
          const operation = (reference[key] as any)[method];

          operation.tags = ["Better Auth"];
        }
      }

      return reference;
    }) as Promise<any>,
  components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;
