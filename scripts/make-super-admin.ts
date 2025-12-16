import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function makeSuperAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error("❌ Error: Email address is required");
    console.log("\nUsage: npm run make-super-admin <email>");
    console.log("Example: npm run make-super-admin user@example.com\n");
    process.exit(1);
  }

  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      console.error(`❌ Error: No user found with email: ${email}`);
      process.exit(1);
    }

    // Check if already super admin
    if (user.role === "SUPER_ADMIN") {
      console.log(`✅ User ${user.email} is already a SUPER_ADMIN`);
      process.exit(0);
    }

    // Update to super admin
    await prisma.user.update({
      where: { email },
      data: { role: "SUPER_ADMIN" },
    });

    console.log("\n✅ Successfully promoted user to SUPER_ADMIN!");
    console.log("\nUser Details:");
    console.log(`  Email: ${user.email}`);
    console.log(`  Name: ${user.name || "Not set"}`);
    console.log(`  Previous Role: ${user.role}`);
    console.log(`  New Role: SUPER_ADMIN`);
    console.log("\n🎉 You now have full system access!\n");
  } catch (error) {
    console.error("❌ Error promoting user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

makeSuperAdmin();
