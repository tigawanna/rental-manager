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
import { leases } from "./leases-schema";

// Payments table tracks rent and related charges against leases and tenants
export const payments = pgTable("payments", {
  ...commonColumns,
  leaseId: uuid("lease_id")
    .notNull()
    .references(() => leases.id, { onDelete: "cascade" }),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  updatedBy: varchar("updated_by", { length: 255 }).notNull(),
  tenantId: varchar("tenant_id", { length: 255 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: date("due_date").notNull(),
  paidDate: date("paid_date"),
  paymentMethod: varchar("payment_method", { length: 50 }), // credit_card, bank_transfer, cash, check
  transactionId: varchar("transaction_id", { length: 255 }),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, paid, late, failed
  paymentType: varchar("payment_type", { length: 50 })
    .notNull()
    .default("rent"), // rent, security_deposit, late_fee, utility
  notes: text("notes"),
});

// Payment relations link each payment to its lease for reporting
export const paymentsRelations = relations(payments, ({ one }) => ({
  lease: one(leases, {
    fields: [payments.leaseId],
    references: [leases.id],
  }),
}));
