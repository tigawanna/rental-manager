import { Collection } from "@tanstack/db";

/**
 * Extracts the schema type from a TanStack DB Collection
 */
export type CollectionSchema<T> = T extends Collection<infer S, any> ? S : never;

/**
 * Gets the keys (column names) from a collection's schema
 */
export type CollectionColumns<T> = keyof CollectionSchema<T> & string;

/**
 * Configuration for a sortable column
 */
export interface ColumnConfig<TColumn extends string> {
  /** The column key from the collection schema */
  value: TColumn;
  /** Human-readable label for the column */
  label: string;
}

/**
 * Helper to create sortable columns config with type safety
 *
 * @example
 * ```tsx
 * const sortableColumns = createSortableColumns(organizationsCollection, [
 *   { value: "name", label: "Name" },
 *   { value: "createdAt", label: "Created" },
 * ]);
 * ```
 */
export function createSortableColumns<
  TCollection extends Collection<any, any>,
  TColumns extends CollectionColumns<TCollection>,
>(_collection: TCollection, columns: Array<ColumnConfig<TColumns>>): Array<ColumnConfig<TColumns>> {
  return columns;
}
