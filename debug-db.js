
const { PrismaClient } = require('@prisma/client');
const client = new PrismaClient();

async function main() {
  try {
    const users = await client.user.findMany({
      select: {
        email: true,
        emailVerified: true,
        verificationToken: true,
        verificationTokenExpiry: true
      }
    });
    console.log('--- USERS IN DB ---');
    console.log(JSON.stringify(users, null, 2));
    console.log('-------------------');
  } catch (err) {
    console.error('Error fetching users:', err);
  } finally {
    await client.$disconnect();
  }
}

main();
