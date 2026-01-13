# Rental Manager Database Schema

## Overview

Complete Drizzle ORM schema for a rental property management system with RBAC integration.

## Schema Structure

### Multiple Schema Files

Following Drizzle best practices, schemas are organized by domain:

```
src/db/schema/
├── auth.ts           # Better Auth tables + user relations
├── properties.ts     # Property management
├── units.ts          # Individual rental units
├── leases.ts         # Lease agreements
├── payments.ts       # Payment tracking
├── maintenance.ts    # Maintenance requests
├── documents.ts      # Document storage
└── index.ts          # Schema exports
```

## Tables

### Auth Tables (Better Auth)

- **user** - User accounts with RBAC roles (admin, landlord, manager, staff, tenant)
- **session** - User sessions with impersonation support
- **account** - OAuth/credential accounts
- **verification** - Email/phone verification tokens

### Core Tables

#### properties

- Property information (address, type, total units)
- Links to landlord and optional manager
- One-to-many: units, maintenance requests

#### units

- Individual rental units within properties
- Details: bedrooms, bathrooms, square feet, rent amount
- Availability status
- One-to-many: leases, maintenance requests

#### leases

- Lease agreements between tenants and units
- Start/end dates, rent amount, security deposit
- Status: active, expired, terminated
- One-to-many: payments

#### payments

- Rent and other payment tracking
- Payment status: pending, paid, late, failed
- Payment types: rent, security_deposit, late_fee, utility
- Links to lease and tenant

#### maintenance_requests

- Maintenance/repair requests
- Category: plumbing, electrical, hvac, appliance, structural
- Priority: low, medium, high, urgent
- Status: open, in_progress, completed, cancelled
- Assignment to staff members

#### documents

- File storage metadata
- Categories: lease_agreement, inspection, invoice, photo, other
- Links to properties, leases, or standalone

## Relations

### User Relations

- `ownedProperties` - Properties where user is landlord
- `managedProperties` - Properties where user is manager
- `leases` - Leases where user is tenant
- `payments` - Payments made by user
- `maintenanceRequests` - Requests created by user
- `assignedMaintenance` - Maintenance assigned to user (staff)
- `uploadedDocuments` - Documents uploaded by user

### Hierarchical Structure

```
User (Landlord)
  └─> Property
       └─> Unit
            └─> Lease (User as Tenant)
                 └─> Payment
```

## RBAC Integration

Roles defined in `/src/lib/auth-rbac.ts`:

- **admin** - Full system access
- **landlord** - Property owners, can manage properties/tenants/leases
- **manager** - Day-to-day operations
- **staff** - Maintenance work and viewing data
- **tenant** - View own data, create maintenance requests

## Generate Migrations

```bash
# Generate migration
pnpm drizzle-kit generate

# Push to database
pnpm drizzle-kit push

# Open Drizzle Studio
pnpm drizzle-kit studio
```

## Usage Example

```typescript
import { db } from "@/db/client";
import { properties, units, leases } from "@/db/schema";
import { eq } from "drizzle-orm";

// Query with relations
const propertyWithUnits = await db.query.properties.findFirst({
  where: eq(properties.id, propertyId),
  with: {
    units: {
      with: {
        leases: true,
      },
    },
  },
});

// Insert new property
await db.insert(properties).values({
  name: "Sunset Apartments",
  address: "123 Main St",
  city: "San Francisco",
  state: "CA",
  zipCode: "94102",
  propertyType: "apartment",
  totalUnits: 20,
  landlordId: userId,
});
```

## Common Columns

All tables include via `commonColumns`:

- `id` - UUID v7 primary key
- `created_at` - Timestamp (auto-set on insert)
- `updated_at` - Timestamp (auto-updated)
