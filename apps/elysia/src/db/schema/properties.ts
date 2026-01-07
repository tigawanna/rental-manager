import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { commonColumns } from "../helpers/columns";
import { units } from "./units";
import { maintenanceRequests } from "./maintenance";

// Properties table stores rental assets with landlord/manager linkage and basic metadata
export const properties = pgTable("properties", {
  ...commonColumns,
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
  landlordId: varchar("landlord_id", { length: 255 }).notNull(),
  managerId: varchar("manager_id", { length: 255 }),
  isActive: boolean("is_active").notNull().default(true),
});

// Property relations map to units within each property and maintenance activity
export const propertiesRelations = relations(properties, ({ many }) => ({
  units: many(units),
  maintenanceRequests: many(maintenanceRequests),
}));
