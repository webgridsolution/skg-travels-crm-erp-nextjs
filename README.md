# SKG Travels CRM & ERP — Next.js + MySQL

A full-stack TypeScript/Next.js App Router rewrite of the SKG Travels CRM/ERP, replacing the earlier Laravel/Blade application. It uses MySQL 8 for persistent data and a single-company tenancy model with configurable brands/branches, server-enforced permissions, branch-scoped operations, audit logging, and transaction-safe workflows.

## Requirements

- Node.js 20.9+ (Node 22 LTS recommended)
- MySQL 8.0+ (`utf8mb4_0900_ai_ci` is used by the schema)

## Local setup

1. Create an empty MySQL database:

   ```sql
   CREATE DATABASE skg_travels CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
   ```

2. Copy `.env.example` to `.env.local`, fill in the MySQL connection settings, and set `SEED_ADMIN_EMAIL` plus a unique `SEED_ADMIN_PASSWORD` of at least 12 characters. The seed script rejects the example password. Keep `.env.local` and production credentials private.

3. Install dependencies and initialize the schema and starter company, branches, roles, permissions, and accounting accounts:

   ```bash
   npm ci
   npm run db:migrate
   npm run db:seed
   ```

4. Start the app and sign in with the seed admin credentials:

   ```bash
   npm run dev
   ```

For production, configure the database, use HTTPS, and set `COOKIE_SECURE=true` (production mode also marks session cookies secure). Run migrations and seed deliberately, then use `npm run build` and `npm run start`. Review every environment variable in `.env.example` before deployment.

## Useful commands

```bash
npm run dev       # development server
npm run build     # optimized production build
npm run start     # serve the production build
npm run typecheck # TypeScript check
npm run lint      # ESLint
npm test          # pricing and date/time tests
npm run db:migrate
npm run db:seed
```

## Included areas and workflows

- Dashboard, global search, notifications, customer and enquiry directories, effective-dated rate cards, quotations, and bookings.
- Fleet, drivers, vendors, staff profiles, and scheduled/completed vehicle maintenance.
- Trip start/completion with odometer validation and resource-conflict checks; separate billing approval; invoice issuance; payment collection and refunds.
- Expense submission/review and balanced, idempotent journal posting for supported finance events, with a trial balance and reports.
- User account creation and updates, role assignments, user activation/deactivation, custom role/permission editing, company profile editing, and branch create/edit/deactivation.
- Core update forms and safe archive/deactivation actions for customers, enquiries, expenses, vehicles, drivers, vendors, maintenance, rate cards, and staff. Records are retained in the database; this is not hard deletion.
- Server-side authentication, password hashing, company/branch authorization, permission checks, audit events, and transactional numbering.
- Currency calculations use integer paise. Browser `datetime-local` values are interpreted as Asia/Kolkata and converted to UTC for storage.

Default system roles and permission grants are defined in `scripts/seed.ts`. Add vehicle categories/rate cards and operational records before creating live quotations or bookings. Rate cards are configurable inputs, not hard-coded commercial policy.

## Preview without MySQL

In development, when the MySQL variables are absent, the app renders a **read-only demo preview** with sample dashboard and directory data. Write APIs reject writes in this mode. Production requires a database-backed session; the demo identity is never enabled in production.

## Verification and limitations

- TypeScript, ESLint, 8 unit tests, and the optimized Next.js production build pass in the provided workspace.
- No MySQL server is available in this workspace. Migrations, seed execution, SQL authorization, and database-backed CRUD/workflows have **not** been run against a live MySQL instance. Before production use, run the setup on a disposable MySQL 8 database and exercise each workflow with realistic users, branches, and data.
- The project does not include payment-provider integrations, email/SMS delivery, file uploads, or production deployment infrastructure. User accounts are created with temporary passwords; invitation email delivery is not included.
