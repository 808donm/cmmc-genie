#!/usr/bin/env node

const { Client } = require('pg');

async function makeSuperAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error("❌ Error: Email address is required");
    console.log("\nUsage: node scripts/make-super-admin-sql.js <email>");
    console.log("Example: node scripts/make-super-admin-sql.js user@example.com\n");
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // Check if user exists
    const userResult = await client.query(
      'SELECT id, email, name, role FROM "User" WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      console.error(`❌ Error: No user found with email: ${email}`);
      await client.end();
      process.exit(1);
    }

    const user = userResult.rows[0];

    // Check if already super admin
    if (user.role === "SUPER_ADMIN") {
      console.log(`✅ User ${user.email} is already a SUPER_ADMIN`);
      await client.end();
      process.exit(0);
    }

    // Update to super admin
    await client.query(
      'UPDATE "User" SET role = $1 WHERE email = $2',
      ['SUPER_ADMIN', email]
    );

    console.log("\n✅ Successfully promoted user to SUPER_ADMIN!");
    console.log("\nUser Details:");
    console.log(`  Email: ${user.email}`);
    console.log(`  Name: ${user.name || "Not set"}`);
    console.log(`  Previous Role: ${user.role}`);
    console.log(`  New Role: SUPER_ADMIN`);
    console.log("\n🎉 You now have full system access!\n");
  } catch (error) {
    console.error("❌ Error promoting user:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

makeSuperAdmin();
