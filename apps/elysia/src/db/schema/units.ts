import { relations } from "drizzle-orm";
import { boolean, integer, numeric, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { commonColumns } from "../helpers/columns";
import { properties } from "./properties";
import { leases } from "./leases";
import { maintenanceRequests } from "./maintenance";

// Units table stores individual rentable units within a property (pricing, availability, amenities)
export const units = pgTable("units", {
  ...commonColumns,
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  unitNumber: varchar("unit_number", { length: 50 }).notNull(),
  floor: integer("floor"),
  bedrooms: integer("bedrooms").notNull().default(1),
  bathrooms: numeric("bathrooms", { precision: 3, scale: 1 }).notNull().default("1.0"),
  squareFeet: integer("square_feet"),
  rentAmount: numeric("rent_amount", { precision: 10, scale: 2 }).notNull(),
  securityDeposit: numeric("security_deposit", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  isAvailable: boolean("is_available").notNull().default(true),
  amenities: text("amenities"), // JSON string of amenities
});

// Unit relations tie each unit to its property, leases, and maintenance requests
export const unitsRelations = relations(units, ({ one, many }) => ({
  property: one(properties, {
    fields: [units.propertyId],
    references: [properties.id],
  }),
  leases: many(leases),
  maintenanceRequests: many(maintenanceRequests),
}));
