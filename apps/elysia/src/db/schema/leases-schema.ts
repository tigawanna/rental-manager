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
import { payments } from "./payments-schema";
import { units } from "./units-schema";

// Leases table captures rental agreements between tenants and units with rent terms
export const leases = pgTable("leases", {
  ...commonColumns,
  unitId: uuid("unit_id")
    .notNull()
    .references(() => units.id, { onDelete: "cascade" }),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  updatedBy: varchar("updated_by", { length: 255 }).notNull(),
  tenantId: varchar("tenant_id", { length: 255 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  monthlyRent: numeric("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  securityDeposit: numeric("security_deposit", {
    precision: 10,
    scale: 2,
  }).notNull(),
  paymentDueDay: varchar("payment_due_day", { length: 2 })
    .notNull()
    .default("1"), // Day of month
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, expired, terminated
  terms: text("terms"), // Lease terms and conditions
  notes: text("notes"),
});

// Lease relations link leases back to units and forward to payment records
export const leasesRelations = relations(leases, ({ one, many }) => ({
  unit: one(units, {
    fields: [leases.unitId],
    references: [units.id],
  }),
  payments: many(payments),
}));
