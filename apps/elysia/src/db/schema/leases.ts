import { relations } from "drizzle-orm";
import { date, numeric, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { commonColumns } from "../helpers/columns";
import { units } from "./units";
import { payments } from "./payments";

// Leases table captures rental agreements between tenants and units with rent terms
export const leases = pgTable("leases", {
  ...commonColumns,
  unitId: varchar("unit_id", { length: 255 }).notNull().references(() => units.id, { onDelete: "cascade" }),
  tenantId: varchar("tenant_id", { length: 255 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  monthlyRent: numeric("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  securityDeposit: numeric("security_deposit", { precision: 10, scale: 2 }).notNull(),
  paymentDueDay: varchar("payment_due_day", { length: 2 }).notNull().default("1"), // Day of month
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
