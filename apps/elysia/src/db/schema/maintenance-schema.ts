import { relations } from "drizzle-orm";
import {
  date,
  numeric,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { commonColumns } from "../helpers/columns";
import { properties } from "./properties-schema";
import { units } from "./units-schema";

// Maintenance requests table logs repair tickets, assignment, priority, and cost tracking
export const maintenanceRequests = pgTable("maintenance_requests", {
  ...commonColumns,
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  unitId: uuid("unit_id").references(() => units.id, { onDelete: "cascade" }),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  updatedBy: varchar("updated_by", { length: 255 }).notNull(),
  assignedToId: varchar("assigned_to_id", { length: 255 }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // plumbing, electrical, hvac, appliance, structural, etc.
  priority: varchar("priority", { length: 20 }).notNull().default("medium"), // low, medium, high, urgent
  status: varchar("status", { length: 20 }).notNull().default("open"), // open, in_progress, completed, cancelled
  estimatedCost: numeric("estimated_cost", { precision: 10, scale: 2 }),
  actualCost: numeric("actual_cost", { precision: 10, scale: 2 }),
  scheduledDate: date("scheduled_date"),
  completedDate: date("completed_date"),
  notes: text("notes"),
});

// Maintenance relations connect requests to property and optional unit
export const maintenanceRequestsRelations = relations(
  maintenanceRequests,
  ({ one }) => ({
    property: one(properties, {
      fields: [maintenanceRequests.propertyId],
      references: [properties.id],
    }),
    unit: one(units, {
      fields: [maintenanceRequests.unitId],
      references: [units.id],
    }),
  }),
);
