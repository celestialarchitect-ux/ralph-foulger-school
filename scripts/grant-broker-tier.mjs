// One-off script: grant the broker tier to specific users so we can dogfood
// the Tier 4 experience. Run via `railway run node scripts/grant-broker-tier.mjs`
// so DATABASE_URL is loaded from production Railway env.
//
// Tier='broker' grants /broker route access for 365 days. The user's
// header nav switches to the broker-specific items.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Emails to grant broker access. Searches case-insensitively by exact match
// AND by first-name prefix for safety.
const GRANTS = [
  { match: { email: 'elysianwand@gmail.com' }, label: 'Zach (Oracle)' },
  { match: { nameContains: 'shayne' },          label: 'Shayne (Guthrie)' },
];

const DAYS = 365 * 5; // five years — effectively lifetime for dogfood accounts
const DAY_MS = 24 * 60 * 60 * 1000;

async function main() {
  const newExpiry = new Date(Date.now() + DAYS * DAY_MS);

  for (const g of GRANTS) {
    let users = [];
    if (g.match.email) {
      const u = await prisma.user.findUnique({ where: { email: g.match.email } });
      if (u) users.push(u);
    } else if (g.match.nameContains) {
      users = await prisma.user.findMany({
        where: {
          OR: [
            { firstName: { contains: g.match.nameContains, mode: 'insensitive' } },
            { lastName:  { contains: g.match.nameContains, mode: 'insensitive' } },
            { email:     { contains: g.match.nameContains, mode: 'insensitive' } },
            { name:      { contains: g.match.nameContains, mode: 'insensitive' } },
          ],
        },
      });
    }

    if (users.length === 0) {
      console.log(`[skip] ${g.label}: no user found`);
      continue;
    }

    for (const u of users) {
      await prisma.user.update({
        where: { id: u.id },
        data: { tier: 'broker', accessExpiresAt: newExpiry },
      });
      console.log(`[granted] ${g.label}: ${u.email} (${u.name}) → tier=broker, expires ${newExpiry.toISOString()}`);
    }
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('FAILED', err);
  await prisma.$disconnect();
  process.exit(1);
});
