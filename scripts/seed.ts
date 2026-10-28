
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

const perms = [
  'dashboard.view',
  'customers.view', 'customers.create', 'customers.update', 'customers.delete',
  'enquiries.view', 'enquiries.create', 'enquiries.update', 'enquiries.assign',
  'quotations.view', 'quotations.create', 'quotations.approve',
  'bookings.view', 'bookings.create', 'bookings.update', 'bookings.cancel',
  'trips.view', 'trips.start', 'trips.complete', 'trips.approve',
  'invoices.view', 'invoices.create', 'invoices.void',
  'payments.view', 'payments.create', 'payments.refund',
  'expenses.view', 'expenses.create', 'expenses.approve',
  'expenses.update', 'expenses.delete',
  'vehicles.view', 'vehicles.create', 'vehicles.update', 'vehicles.delete',
  'drivers.view', 'drivers.create', 'drivers.update', 'drivers.delete',
  'vendors.view', 'vendors.create', 'vendors.update', 'vendors.delete',
  'maintenance.view', 'maintenance.create', 'maintenance.update',
  'maintenance.delete', 'maintenance.approve',
  'rates.view', 'rates.create', 'rates.update', 'rates.delete',
  'staff.view', 'staff.create', 'staff.update', 'staff.delete',
  'users.view', 'users.create', 'users.update',
  'branches.view', 'branches.create', 'branches.update', 'branches.access_all',
  'roles.view', 'roles.manage',
  'settings.view', 'settings.manage',
  'reports.view', 'accounting.view', 'audit.view',

  // Area SEO permissions
  'area_seo.view',
  'area_seo.create',
  'area_seo.update',
  'area_seo.delete'
];

async function main() {
  const {
    MYSQL_DATABASE,
    MYSQL_USER,
    SEED_ADMIN_EMAIL,
    SEED_ADMIN_PASSWORD
  } = process.env;

  if (!MYSQL_DATABASE || !MYSQL_USER) {
    throw new Error('Set MySQL settings first.');
  }

  if (
    !SEED_ADMIN_EMAIL ||
    !SEED_ADMIN_PASSWORD ||
    SEED_ADMIN_PASSWORD === 'ChangeMe!12345' ||
    SEED_ADMIN_PASSWORD === 'replace-with-a-unique-password-at-least-12-chars' ||
    SEED_ADMIN_PASSWORD.length < 12
  ) {
    throw new Error(
      'Set a unique SEED_ADMIN_PASSWORD of at least 12 characters (do not use the example password).'
    );
  }

  const c = await mysql.createConnection({
    host: process.env.MYSQL_HOST ?? '127.0.0.1',
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: MYSQL_DATABASE,
    user: MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  });

  try {
    await c.query("SET time_zone = '+00:00'");
    await c.beginTransaction();

    // Company
    await c.execute(
      `INSERT INTO companies
        (name, legal_name, slug, email, phone, city, state)
       VALUES (?, ?, ?, ?, '+91 00000 00000', 'Patna', 'Bihar')
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [
        'SKG Travels',
        'SKG Travels',
        'skg-travels',
        SEED_ADMIN_EMAIL.toLowerCase()
      ]
    );

    const [[co]]: any = await c.query(
      'SELECT id FROM companies WHERE slug = ?',
      ['skg-travels']
    );

    const cid = Number(co.id);

    // Brand
    await c.execute(
      `INSERT INTO brands (company_id, name, slug)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      [cid, 'SKG Travels', 'skg-travels']
    );

    const [[brand]]: any = await c.query(
      'SELECT id FROM brands WHERE company_id = ? AND slug = ?',
      [cid, 'skg-travels']
    );

    // Branches
    for (const [code, name, city] of [
      ['PATNA', 'Patna Branch', 'Patna'],
      ['BEGUSARAI', 'Begusarai Head Office', 'Begusarai']
    ]) {
      await c.execute(
        `INSERT INTO branches
          (company_id, brand_id, name, code, city, state)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [cid, brand.id, name, code, city, 'Bihar']
      );
    }

    const [branchRows]: any = await c.query(
      'SELECT id, code FROM branches WHERE company_id = ?',
      [cid]
    );

    const branchId = Number(
      branchRows.find((x: any) => x.code === 'PATNA')?.id ??
      branchRows[0]?.id
    );

    if (!branchId) {
      throw new Error('Could not find or create the Patna branch.');
    }

    // Vehicle categories
    for (const [name, slug, seats] of [
      ['Sedan', 'sedan', 4],
      ['SUV', 'suv', 7],
      ['Tempo Traveller', 'tempo-traveller', 12],
      ['Bus', 'bus', 32]
    ]) {
      await c.execute(
        `INSERT INTO vehicle_categories
          (company_id, name, slug, default_seating_capacity)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [cid, name, slug, seats]
      );
    }

    // Permissions, including Area SEO
    for (const p of perms) {
      await c.execute(
        'INSERT IGNORE INTO permissions (name) VALUES (?)',
        [p]
      );
    }

    // System roles
    for (const name of [
      'Super Admin',
      'Operations Manager',
      'Sales Executive',
      'Dispatcher',
      'Accountant',
      'Fleet Manager',
      'Driver'
    ]) {
      await c.execute(
        `INSERT INTO roles (company_id, name, is_system)
         VALUES (?, ?, 1)
         ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
        [cid, name]
      );
    }

    // Role permissions
    const rolePermissions: Record<string, string[]> = {
      'Super Admin': perms,

      'Operations Manager': [
        'dashboard.view',
        'customers.view', 'customers.create', 'customers.update', 'customers.delete',
        'enquiries.view', 'enquiries.create', 'enquiries.update', 'enquiries.assign',
        'quotations.view', 'quotations.create', 'quotations.approve',
        'bookings.view', 'bookings.create', 'bookings.update', 'bookings.cancel',
        'trips.view', 'trips.start', 'trips.complete', 'trips.approve',
        'invoices.view', 'invoices.create',
        'payments.view', 'payments.create',
        'expenses.view', 'expenses.create', 'expenses.approve',
        'expenses.update', 'expenses.delete',
        'vehicles.view', 'vehicles.update',
        'drivers.view', 'drivers.update',
        'vendors.view', 'vendors.update',
        'maintenance.view', 'maintenance.create', 'maintenance.update',
        'maintenance.approve',
        'rates.view', 'rates.update',
        'staff.view', 'staff.update',
        'users.view', 'users.create', 'users.update',
        'branches.view',
        'roles.view', 'roles.manage',
        'reports.view', 'accounting.view'
      ],

      'Sales Executive': [
        'dashboard.view',
        'customers.view', 'customers.create', 'customers.update', 'customers.delete',
        'enquiries.view', 'enquiries.create', 'enquiries.update',
        'quotations.view', 'quotations.create',
        'bookings.view', 'bookings.create',
        'invoices.view',
        'reports.view'
      ],

      'Dispatcher': [
        'dashboard.view',
        'customers.view',
        'enquiries.view',
        'bookings.view', 'bookings.create', 'bookings.update',
        'trips.view', 'trips.start', 'trips.complete',
        'vehicles.view',
        'drivers.view',
        'branches.view'
      ],

      'Accountant': [
        'dashboard.view',
        'customers.view',
        'invoices.view', 'invoices.create',
        'payments.view', 'payments.create', 'payments.refund',
        'expenses.view', 'expenses.approve',
        'accounting.view',
        'reports.view',
        'audit.view'
      ],

      'Fleet Manager': [
        'dashboard.view',
        'vehicles.view', 'vehicles.create', 'vehicles.update', 'vehicles.delete',
        'drivers.view', 'drivers.create', 'drivers.update', 'drivers.delete',
        'maintenance.view', 'maintenance.create', 'maintenance.update',
        'maintenance.delete', 'maintenance.approve',
        'rates.view', 'rates.create', 'rates.update', 'rates.delete',
        'trips.view',
        'reports.view'
      ],

      'Driver': [
        'dashboard.view',
        'trips.view', 'trips.start', 'trips.complete'
      ]
    };

    const [permissionRows]: any = await c.query(
      'SELECT id, name FROM permissions'
    );

    const permissionIds = new Map(
      permissionRows.map((p: any) => [p.name, p.id])
    );

    for (const [roleName, names] of Object.entries(rolePermissions)) {
      const [[r]]: any = await c.query(
        'SELECT id FROM roles WHERE company_id = ? AND name = ?',
        [cid, roleName]
      );

      if (!r) {
        throw new Error(`Role not found: ${roleName}`);
      }

      for (const name of names) {
        const permissionId = permissionIds.get(name);

        if (permissionId) {
          await c.execute(
            `INSERT IGNORE INTO role_permissions
              (role_id, permission_id)
             VALUES (?, ?)`,
            [r.id, permissionId]
          );
        }
      }
    }

    // Super Admin role
    const [[role]]: any = await c.query(
      'SELECT id FROM roles WHERE company_id = ? AND name = ?',
      [cid, 'Super Admin']
    );

    // Admin user
    const hash = await bcrypt.hash(SEED_ADMIN_PASSWORD, 12);

    const [existingAdmins]: any = await c.query(
      'SELECT id, company_id FROM users WHERE email = ?',
      [SEED_ADMIN_EMAIL.toLowerCase()]
    );

    if (
      existingAdmins.length &&
      Number(existingAdmins[0].company_id) !== cid
    ) {
      throw new Error(
        'Seed admin email belongs to a different company. Choose another admin email.'
      );
    }

    if (existingAdmins.length) {
      await c.execute(
        `UPDATE users
         SET branch_id = ?, name = ?, password_hash = ?, is_active = 1
         WHERE id = ?`,
        [
          branchId,
          'SKG Administrator',
          hash,
          existingAdmins[0].id
        ]
      );
    } else {
      await c.execute(
        `INSERT INTO users
          (company_id, branch_id, name, email, password_hash, is_active)
         VALUES (?, ?, ?, ?, ?, 1)`,
        [
          cid,
          branchId,
          'SKG Administrator',
          SEED_ADMIN_EMAIL.toLowerCase(),
          hash
        ]
      );
    }

    const [[admin]]: any = await c.query(
      'SELECT id FROM users WHERE email = ?',
      [SEED_ADMIN_EMAIL.toLowerCase()]
    );

    await c.execute(
      'INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)',
      [admin.id, role.id]
    );

    for (const b of branchRows) {
      await c.execute(
        'INSERT IGNORE INTO user_branches (user_id, branch_id) VALUES (?, ?)',
        [admin.id, b.id]
      );
    }

    // Accounting accounts
    for (const [code, name, type, side] of [
      ['1000', 'Cash & Bank', 'asset', 'debit'],
      ['1100', 'Accounts Receivable', 'asset', 'debit'],
      ['2000', 'Vendor Payables', 'liability', 'credit'],
      ['2100', 'GST Payable', 'liability', 'credit'],
      ['3000', 'Retained Earnings', 'equity', 'credit'],
      ['4000', 'Trip Revenue', 'income', 'credit'],
      ['5000', 'Operating Expenses', 'expense', 'debit'],
      ['5100', 'Vehicle Operating Costs', 'expense', 'debit']
    ]) {
      await c.execute(
        `INSERT INTO accounts
          (company_id, code, name, type, normal_side)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [cid, code, name, type, side]
      );
    }

    await c.commit();

    console.log(
      `Seeded SKG Travels. Admin: ${SEED_ADMIN_EMAIL}.`
    );
    console.log('Area SEO permissions added successfully.');
  } catch (e) {
    await c.rollback();
    throw e;
  } finally {
    await c.end();
  }
}

main().catch(e => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
