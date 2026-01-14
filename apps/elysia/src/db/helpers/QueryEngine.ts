import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  getTableName,
  gt,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  lt,
  lte,
  ne,
  notInArray,
  notLike,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";

import { db } from "@/db/client";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Extract the inferred select type from a Drizzle table
 */
export type InferSelectModel<T extends PgTable> = T["$inferSelect"];

/**
 * Extract the inferred insert type from a Drizzle table
 */
export type InferInsertModel<T extends PgTable> = T["$inferInsert"];

/**
 * List query parameters matching PocketBase-style API
 */
export interface ListParams {
  /** Page number (1-indexed, default: 1) */
  page?: number;
  /** Records per page (default: 30, max: 500) */
  perPage?: number;
  /** 
   * Sort order. Use -field for DESC, +field or field for ASC.
   * Multiple fields separated by comma: "-created,id"
   * Special: "@random" for random order
   */
  sort?: string;
  /** 
   * Filter expression. Supports:
   * - Comparison: =, !=, >, >=, <, <=
   * - String: ~, !~ (contains/not contains), ^, !^ (starts/not starts with)
   * - Null checks: = null, != null
   * - Logical: &&, ||, ()
   * Example: "(status='active' && created>'2024-01-01') || priority>=5"
   */
  filter?: string;
  /** 
   * Comma-separated relations to expand.
   * Example: "organization,units.property"
   * Supports up to 6 levels of nesting
   */
  expand?: string;
  /** 
   * Comma-separated fields to return. Use * for all fields at current level.
   * Supports :excerpt(maxLength, withEllipsis?) modifier
   * Example: "*,expand.relField.name,description:excerpt(200,true)"
   */
  fields?: string;
  /** Skip total count query for faster results (totalItems/totalPages = -1) */
  skipTotal?: boolean;
}

/**
 * Paginated list response
 */
export interface PaginatedResponse<T> {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  items: T[];
}

/**
 * Filter operators supported in filter expressions
 */
type FilterOperator =
  | "="
  | "!="
  | ">"
  | ">="
  | "<"
  | "<="
  | "~"   // contains (case-insensitive)
  | "!~"  // not contains
  | "?="  // any of (in array)
  | "?!=" // none of (not in array)
  | "^"   // starts with (case-insensitive)
  | "!^"; // not starts with

interface ParsedFilter {
  field: string;
  operator: FilterOperator;
  value: string | string[] | null;
}

interface ParsedSort {
  field: string;
  direction: "asc" | "desc";
}

// ============================================================================
// FILTER PARSER
// ============================================================================

class FilterParser {
  /**
   * Parse a filter string into SQL conditions
   */
  static parse<T extends PgTable>(
    filterString: string,
    table: T,
  ): SQL<unknown> | undefined {
    if (!filterString || filterString.trim() === "") {
      return undefined;
    }

    const columns = getTableColumns(table);
    return this.parseExpression(filterString.trim(), columns);
  }

  private static parseExpression(
    expr: string,
    columns: Record<string, PgColumn>,
  ): SQL<unknown> | undefined {
    expr = expr.trim();
    if (!expr) return undefined;

    // Handle parentheses groups
    if (expr.startsWith("(") && this.findMatchingParen(expr, 0) === expr.length - 1) {
      return this.parseExpression(expr.slice(1, -1), columns);
    }

    // Find top-level OR (||)
    const orIndex = this.findTopLevelOperator(expr, "||");
    if (orIndex !== -1) {
      const left = this.parseExpression(expr.slice(0, orIndex), columns);
      const right = this.parseExpression(expr.slice(orIndex + 2), columns);
      if (left && right) return or(left, right);
      return left || right;
    }

    // Find top-level AND (&&)
    const andIndex = this.findTopLevelOperator(expr, "&&");
    if (andIndex !== -1) {
      const left = this.parseExpression(expr.slice(0, andIndex), columns);
      const right = this.parseExpression(expr.slice(andIndex + 2), columns);
      if (left && right) return and(left, right);
      return left || right;
    }

    // Parse individual condition
    return this.parseCondition(expr, columns);
  }

  private static findMatchingParen(str: string, start: number): number {
    let depth = 0;
    for (let i = start; i < str.length; i++) {
      if (str[i] === "(") depth++;
      if (str[i] === ")") depth--;
      if (depth === 0) return i;
    }
    return -1;
  }

  private static findTopLevelOperator(expr: string, op: string): number {
    let depth = 0;
    let inString = false;
    let stringChar = "";

    for (let i = 0; i < expr.length - op.length + 1; i++) {
      const char = expr[i];

      if ((char === '"' || char === "'") && (i === 0 || expr[i - 1] !== "\\")) {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
      }

      if (!inString) {
        if (char === "(") depth++;
        if (char === ")") depth--;
        if (depth === 0 && expr.slice(i, i + op.length) === op) {
          return i;
        }
      }
    }
    return -1;
  }

  private static parseCondition(
    condition: string,
    columns: Record<string, PgColumn>,
  ): SQL<unknown> | undefined {
    // Match patterns like: field='value', field>5, field~'text', etc.
    const patterns = [
      /^(\w+)\s*(!~)\s*(.+)$/,   // not contains
      /^(\w+)\s*(!=)\s*(.+)$/,   // not equal
      /^(\w+)\s*(!^)\s*(.+)$/,   // not starts with
      /^(\w+)\s*(\?!=)\s*(.+)$/, // not in array
      /^(\w+)\s*(\?=)\s*(.+)$/,  // in array
      /^(\w+)\s*(>=)\s*(.+)$/,   // greater than or equal
      /^(\w+)\s*(<=)\s*(.+)$/,   // less than or equal
      /^(\w+)\s*(>)\s*(.+)$/,    // greater than
      /^(\w+)\s*(<)\s*(.+)$/,    // less than
      /^(\w+)\s*(~)\s*(.+)$/,    // contains
      /^(\w+)\s*(\^)\s*(.+)$/,   // starts with
      /^(\w+)\s*(=)\s*(.+)$/,    // equal
    ];

    for (const pattern of patterns) {
      const match = condition.match(pattern);
      if (match) {
        const [, field, operator, rawValue] = match;
        const column = columns[field];

        if (!column) {
          console.warn(`Unknown filter field: ${field}`);
          return undefined;
        }

        const value = this.parseValue(rawValue.trim());
        return this.buildCondition(column, operator as FilterOperator, value);
      }
    }

    console.warn(`Could not parse filter condition: ${condition}`);
    return undefined;
  }

  private static parseValue(raw: string): string | string[] | null {
    // Handle null
    if (raw.toLowerCase() === "null") return null;

    // Handle array: [val1, val2, val3]
    if (raw.startsWith("[") && raw.endsWith("]")) {
      const inner = raw.slice(1, -1);
      return inner.split(",").map((v) => this.unquote(v.trim()));
    }

    // Handle quoted string
    return this.unquote(raw);
  }

  private static unquote(str: string): string {
    if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
      return str.slice(1, -1);
    }
    return str;
  }

  private static buildCondition(
    column: PgColumn,
    operator: FilterOperator,
    value: string | string[] | null,
  ): SQL<unknown> | undefined {
    switch (operator) {
      case "=":
        if (value === null) return isNull(column);
        return eq(column, value);
      case "!=":
        if (value === null) return isNotNull(column);
        return ne(column, value);
      case ">":
        return gt(column, value);
      case ">=":
        return gte(column, value);
      case "<":
        return lt(column, value);
      case "<=":
        return lte(column, value);
      case "~":
        return ilike(column, `%${value}%`);
      case "!~":
        return notLike(column, `%${value}%`);
      case "^":
        return ilike(column, `${value}%`);
      case "!^":
        return notLike(column, `${value}%`);
      case "?=":
        if (Array.isArray(value)) return inArray(column, value);
        return eq(column, value);
      case "?!=":
        if (Array.isArray(value)) return notInArray(column, value);
        return ne(column, value);
      default:
        return undefined;
    }
  }
}

// ============================================================================
// SORT PARSER
// ============================================================================

class SortParser {
  /**
   * Parse a sort string into SQL order by clauses
   */
  static parse<T extends PgTable>(
    sortString: string,
    table: T,
  ): SQL<unknown>[] {
    if (!sortString || sortString.trim() === "") {
      return [];
    }

    const columns = getTableColumns(table);
    const parts = sortString.split(",").map((s) => s.trim());
    const orderClauses: SQL<unknown>[] = [];

    for (const part of parts) {
      if (!part) continue;

      // Handle @random
      if (part === "@random") {
        orderClauses.push(sql`RANDOM()`);
        continue;
      }

      // Determine direction and field
      let direction: "asc" | "desc" = "asc";
      let field = part;

      if (part.startsWith("-")) {
        direction = "desc";
        field = part.slice(1);
      } else if (part.startsWith("+")) {
        field = part.slice(1);
      }

      const column = columns[field];
      if (!column) {
        console.warn(`Unknown sort field: ${field}`);
        continue;
      }

      orderClauses.push(direction === "desc" ? desc(column) : asc(column));
    }

    return orderClauses;
  }
}

// ============================================================================
// FIELD SELECTOR
// ============================================================================

class FieldSelector {
  /**
   * Parse fields string and apply :excerpt modifier
   */
  static applyExcerpt(value: string, modifier: string): string {
    const match = modifier.match(/^:excerpt\((\d+)(?:,\s*(true|false))?\)$/);
    if (!match) return value;

    const maxLength = parseInt(match[1], 10);
    const withEllipsis = match[2] !== "false";

    if (typeof value !== "string") return value;
    if (value.length <= maxLength) return value;

    const truncated = value.slice(0, maxLength);
    return withEllipsis ? `${truncated}...` : truncated;
  }

  /**
   * Filter and transform result fields based on fields parameter
   */
  static selectFields<T extends Record<string, any>>(
    items: T[],
    fieldsString: string | undefined,
  ): Partial<T>[] {
    if (!fieldsString || fieldsString === "*") {
      return items;
    }

    const fieldSpecs = this.parseFieldSpecs(fieldsString);

    return items.map((item) => {
      const result: Record<string, any> = {};

      for (const spec of fieldSpecs) {
        if (spec.field === "*") {
          // Include all fields at this level
          Object.assign(result, item);
        } else if (spec.field.startsWith("expand.")) {
          // Handle expand fields separately
          const expandPath = spec.field.slice(7);
          if (item.expand) {
            this.setNestedValue(result, `expand.${expandPath}`, this.getNestedValue(item, spec.field));
          }
        } else {
          let value = item[spec.field];
          if (spec.modifier && typeof value === "string") {
            value = this.applyExcerpt(value, spec.modifier);
          }
          if (value !== undefined) {
            result[spec.field] = value;
          }
        }
      }

      return result as Partial<T>;
    });
  }

  private static parseFieldSpecs(fieldsString: string): Array<{ field: string; modifier?: string }> {
    const specs: Array<{ field: string; modifier?: string }> = [];
    const parts = fieldsString.split(",");

    for (const part of parts) {
      const trimmed = part.trim();
      const modifierMatch = trimmed.match(/^(.+?)(:excerpt\(.+?\))$/);

      if (modifierMatch) {
        specs.push({ field: modifierMatch[1], modifier: modifierMatch[2] });
      } else {
        specs.push({ field: trimmed });
      }
    }

    return specs;
  }

  private static getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((curr, key) => curr?.[key], obj);
  }

  private static setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split(".");
    const lastKey = keys.pop()!;
    const target = keys.reduce((curr, key) => {
      if (!curr[key]) curr[key] = {};
      return curr[key];
    }, obj);
    target[lastKey] = value;
  }
}

// ============================================================================
// DRIZZLE QUERY ENGINE
// ============================================================================

/**
 * Type-safe CRUD query engine for Drizzle tables
 * Provides PocketBase-style list API with filtering, sorting, pagination, and field selection
 */
export class DrizzleQueryEngine<
  TTable extends PgTable,
  TSelect = InferSelectModel<TTable>,
  TInsert = InferInsertModel<TTable>,
> {
  protected table: TTable;
  protected tableName: string;
  private relations?: Record<string, { table: PgTable; foreignKey: string; localKey: string }>;

  constructor(
    table: TTable,
    options?: {
      relations?: Record<string, { table: PgTable; foreignKey: string; localKey: string }>;
    },
  ) {
    this.table = table;
    this.tableName = getTableName(table);
    this.relations = options?.relations;
  }

  // ==========================================================================
  // LIST (Paginated)
  // ==========================================================================

  /**
   * Get a paginated list of records with filtering, sorting, and field selection
   */
  async list(params: ListParams = {}): Promise<PaginatedResponse<TSelect>> {
    const {
      page = 1,
      perPage = 30,
      sort,
      filter,
      fields,
      skipTotal = false,
    } = params;

    // Validate and constrain pagination
    const safePage = Math.max(1, Math.floor(page));
    const safePerPage = Math.min(500, Math.max(1, Math.floor(perPage)));
    const offset = (safePage - 1) * safePerPage;

    // Parse filter conditions
    const filterCondition = FilterParser.parse(filter || "", this.table);

    // Parse sort orders
    const orderClauses = SortParser.parse(sort || "", this.table);

    // Build base query
    let query = db
      .select()
      // @ts-expect-error - Drizzle generic type inference issue with PgTable
      .from(this.table)
      .limit(safePerPage)
      .offset(offset);

    // Apply filter
    if (filterCondition) {
      query = query.where(filterCondition) as typeof query;
    }

    // Apply sorting
    if (orderClauses.length > 0) {
      query = query.orderBy(...orderClauses) as typeof query;
    }

    // Execute main query
    const items = await query;

    // Get total count (unless skipped)
    let totalItems = -1;
    let totalPages = -1;

    if (!skipTotal) {
      const countQuery = db
        .select({ count: sql<number>`count(*)::int` })
        // @ts-expect-error - Drizzle generic type inference issue with PgTable
        .from(this.table);

      if (filterCondition) {
        countQuery.where(filterCondition);
      }

      const [{ count }] = await countQuery;
      totalItems = count;
      totalPages = Math.ceil(count / safePerPage);
    }

    // Apply field selection
    const selectedItems = FieldSelector.selectFields(items as any[], fields);

    return {
      page: safePage,
      perPage: safePerPage,
      totalPages,
      totalItems,
      items: selectedItems as TSelect[],
    };
  }

  /**
   * Get the first item matching the filter (convenience method)
   */
  async getFirstListItem(
    filter: string,
    params: Omit<ListParams, "filter" | "page" | "perPage"> = {},
  ): Promise<TSelect | null> {
    const result = await this.list({
      ...params,
      filter,
      page: 1,
      perPage: 1,
      skipTotal: true,
    });
    return result.items[0] || null;
  }

  /**
   * Get all items matching the filter (auto-paginated, use with caution)
   */
  async getFullList(params: Omit<ListParams, "page"> = {}): Promise<TSelect[]> {
    const allItems: TSelect[] = [];
    let page = 1;
    const perPage = params.perPage || 500;

    while (true) {
      const result = await this.list({
        ...params,
        page,
        perPage,
        skipTotal: true,
      });

      allItems.push(...result.items);

      if (result.items.length < perPage) {
        break;
      }
      page++;

      // Safety limit
      if (page > 1000) {
        console.warn("getFullList safety limit reached (1000 pages)");
        break;
      }
    }

    return allItems;
  }

  // ==========================================================================
  // GET ONE
  // ==========================================================================

  /**
   * Get a single record by ID
   */
  async getOne(
    id: string,
    params: Pick<ListParams, "expand" | "fields"> = {},
  ): Promise<TSelect | null> {
    const columns = getTableColumns(this.table);
    const idColumn = columns["id"];

    if (!idColumn) {
      throw new Error(`Table ${this.tableName} does not have an 'id' column`);
    }

    const result = await db
      .select()
      // @ts-expect-error - Drizzle generic type inference issue with PgTable
      .from(this.table)
      .where(eq(idColumn, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const { fields } = params;
    const selectedItems = FieldSelector.selectFields(result as any[], fields);
    return selectedItems[0] as TSelect;
  }

  // ==========================================================================
  // CREATE
  // ==========================================================================

  /**
   * Create a new record
   */
  async create(data: TInsert): Promise<TSelect> {
    const result = await db
      .insert(this.table)
      .values(data as any)
      .returning();

    return result[0] as unknown as TSelect;
  }

  /**
   * Create multiple records in a batch
   */
  async createMany(data: TInsert[]): Promise<TSelect[]> {
    if (data.length === 0) return [];

    const result = await db
      .insert(this.table)
      .values(data as any[])
      .returning();

    return result as unknown as TSelect[];
  }

  // ==========================================================================
  // UPDATE
  // ==========================================================================

  /**
   * Update a record by ID
   */
  async update(id: string, data: Partial<TInsert>): Promise<TSelect | null> {
    const columns = getTableColumns(this.table);
    const idColumn = columns["id"];

    if (!idColumn) {
      throw new Error(`Table ${this.tableName} does not have an 'id' column`);
    }

    const result = (await db
      .update(this.table)
      .set(data as any)
      .where(eq(idColumn, id))
      .returning()) as unknown as TSelect[];

    return result[0] || null;
  }

  /**
   * Update multiple records matching a filter
   */
  async updateMany(
    filter: string,
    data: Partial<TInsert>,
  ): Promise<TSelect[]> {
    const filterCondition = FilterParser.parse(filter, this.table);

    if (!filterCondition) {
      throw new Error("Filter is required for updateMany operation");
    }

    const result = await db
      .update(this.table)
      .set(data as any)
      .where(filterCondition)
      .returning();

    return result as unknown as TSelect[];
  }

  // ==========================================================================
  // DELETE
  // ==========================================================================

  /**
   * Delete a record by ID
   */
  async delete(id: string): Promise<TSelect | null> {
    const columns = getTableColumns(this.table);
    const idColumn = columns["id"];

    if (!idColumn) {
      throw new Error(`Table ${this.tableName} does not have an 'id' column`);
    }

    const result = await db
      .delete(this.table)
      .where(eq(idColumn, id))
      .returning();

    return (result[0] as unknown as TSelect) || null;
  }

  /**
   * Delete multiple records matching a filter
   */
  async deleteMany(filter: string): Promise<TSelect[]> {
    const filterCondition = FilterParser.parse(filter, this.table);

    if (!filterCondition) {
      throw new Error("Filter is required for deleteMany operation");
    }

    const result = await db
      .delete(this.table)
      .where(filterCondition)
      .returning();

    return result as unknown as TSelect[];
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  /**
   * Check if a record exists by ID
   */
  async exists(id: string): Promise<boolean> {
    const columns = getTableColumns(this.table);
    const idColumn = columns["id"];

    if (!idColumn) {
      throw new Error(`Table ${this.tableName} does not have an 'id' column`);
    }

    const result = await db
      .select({ id: idColumn })
      // @ts-expect-error - Drizzle generic type inference issue with PgTable
      .from(this.table)
      .where(eq(idColumn, id))
      .limit(1);

    return result.length > 0;
  }

  /**
   * Count records matching an optional filter
   */
  async count(filter?: string): Promise<number> {
    const filterCondition = filter ? FilterParser.parse(filter, this.table) : undefined;

    const query = db
      .select({ count: sql<number>`count(*)::int` })
      // @ts-expect-error - Drizzle generic type inference issue with PgTable
      .from(this.table);

    if (filterCondition) {
      query.where(filterCondition);
    }

    const [{ count }] = await query;
    return count;
  }

  /**
   * Get the underlying Drizzle table reference
   */
  getTable(): TTable {
    return this.table;
  }

  /**
   * Get the table name
   */
  getTableName(): string {
    return this.tableName;
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

/**
 * Create a new query engine instance for a Drizzle table
 */
export function createQueryEngine<TTable extends PgTable>(
  table: TTable,
  options?: {
    relations?: Record<string, { table: PgTable; foreignKey: string; localKey: string }>;
  },
) {
  return new DrizzleQueryEngine(table, options);
}

// ============================================================================
// TYPE EXPORTS FOR EXTERNAL USE
// ============================================================================

export type { ParsedFilter, ParsedSort, FilterOperator };
