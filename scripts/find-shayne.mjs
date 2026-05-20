// Find Shayne — user table + prospects table + support tickets.
// Run via: DATABASE_URL=... node scripts/find-shayne.mjs

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const needle = process.argv[2] ?? 'shayne';
  const ilike = { contains: needle, mode: 'insensitive' };

  console.log(`--- Looking for "${needle}" ---`);

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { firstName: ilike },
        { lastName: ilike },
        { name: ilike },
        { email: ilike },
      ],
    },
    select: { id: true, email: true, name: true, firstName: true, lastName: true, tier: true, isAdmin: true, createdAt: true },
  });
  console.log(`\nUsers (${users.length}):`);
  for (const u of users) {
    console.log(`  ${u.email} | ${u.name} | tier=${u.tier} | admin=${u.isAdmin} | created=${u.createdAt.toISOString().slice(0,10)}`);
  }

  // Variant: also check 'guthrie'
  if (needle.toLowerCase() === 'shayne') {
    const guthrieUsers = await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: 'guthrie', mode: 'insensitive' } },
          { lastName: { contains: 'guthrie', mode: 'insensitive' } },
          { name: { contains: 'guthrie', mode: 'insensitive' } },
          { email: { contains: 'guthrie', mode: 'insensitive' } },
        ],
      },
      select: { id: true, email: true, name: true, tier: true, isAdmin: true },
    });
    console.log(`\nUsers by 'guthrie' (${guthrieUsers.length}):`);
    for (const u of guthrieUsers) {
      console.log(`  ${u.email} | ${u.name} | tier=${u.tier}`);
    }
  }

  await prisma.$disconnect();
}

main().catch(async e => { console.error(e); await prisma.$disconnect(); process.exit(1); });
