import { relations } from "drizzle-orm";
import { boolean, index, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { commonColumns } from "../helpers/columns";
import { organization } from "./auth-schema";
import { maintenanceRequests } from "./maintenance";
import { units } from "./units";

// Properties table stores rental assets scoped to organizations
// Access control is determined by organization membership and member roles
export const properties = pgTable(
  "properties",
  {
    ...commonColumns,
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    address: text("address").notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 50 }).notNull(),
    zipCode: varchar("zip_code", { length: 20 }).notNull(),
    country: varchar("country", { length: 100 }).notNull().default("USA"),
    propertyType: varchar("property_type", { length: 50 }).notNull(), // apartment, house, commercial, etc.
    totalUnits: integer("total_units").notNull().default(1),
    yearBuilt: integer("year_built"),
    description: text("description"),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [index("properties_organizationId_idx").on(table.organizationId)],
);

// Property relations map to organization, units within each property, and maintenance activity
export const propertiesRelations = relations(
  properties,
  ({ one, many }) => ({
    organization: one(organization, {
      fields: [properties.organizationId],
      references: [organization.id],
    }),
    units: many(units),
    maintenanceRequests: many(maintenanceRequests),
  }),
);
