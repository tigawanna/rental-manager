import { relations } from "drizzle-orm";
import { integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { commonColumns } from "../helpers/columns";
import { properties } from "./properties";
import { leases } from "./leases";

// Documents table stores file metadata for leases, properties, inspections, and uploads
export const documents = pgTable("documents", {
  ...commonColumns,
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(), // pdf, jpg, png, doc, etc.
  fileSize: integer("file_size"), // in bytes
  category: varchar("category", { length: 50 }).notNull(), // lease_agreement, inspection, invoice, photo, other
  uploadedById: varchar("uploaded_by_id", { length: 255 }).notNull(),
  propertyId: uuid("property_id").references(() => properties.id, {
    onDelete: "cascade",
  }),
  leaseId: uuid("lease_id").references(() => leases.id, {
    onDelete: "cascade",
  }),
});

// Document relations link files to optional property or lease context
export const documentsRelations = relations(documents, ({ one }) => ({
  property: one(properties, {
    fields: [documents.propertyId],
    references: [properties.id],
  }),
  lease: one(leases, {
    fields: [documents.leaseId],
    references: [leases.id],
  }),
}));
