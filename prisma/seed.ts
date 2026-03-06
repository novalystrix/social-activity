import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create or find users
  const owner = await prisma.user.upsert({
    where: { email: 'vaselin@gmail.com' },
    update: {},
    create: { email: 'vaselin@gmail.com', name: 'Roy' },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'novalystrix@gmail.com' },
    update: {},
    create: { email: 'novalystrix@gmail.com', name: 'Novalystrix' },
  });

  // Create or find account
  const account = await prisma.account.upsert({
    where: { slug: 'novalystrix' },
    update: {},
    create: {
      name: 'Novalystrix',
      slug: 'novalystrix',
      botName: 'Nova',
    },
  });

  console.log(`Account: ${account.name} (${account.id})`);

  // Add members
  await prisma.accountMember.upsert({
    where: { accountId_userId: { accountId: account.id, userId: owner.id } },
    update: { role: 'owner' },
    create: { accountId: account.id, userId: owner.id, role: 'owner' },
  });

  await prisma.accountMember.upsert({
    where: { accountId_userId: { accountId: account.id, userId: admin.id } },
    update: { role: 'admin' },
    create: { accountId: account.id, userId: admin.id, role: 'admin' },
  });

  console.log(`Members: ${owner.email} (owner), ${admin.email} (admin)`);

  // Add sample draft posts if none exist
  const existingPosts = await prisma.post.count({ where: { accountId: account.id } });
  if (existingPosts === 0) {
    await prisma.post.createMany({
      data: [
        {
          accountId: account.id,
          platform: 'twitter',
          postType: 'original',
          status: 'draft',
          text: 'The most underrated skill in AI deployment: knowing when NOT to use AI. Sometimes a simple script does the job better, faster, and more reliably. Complexity is a cost. #AIEngineering',
        },
        {
          accountId: account.id,
          platform: 'linkedin',
          postType: 'philosophy',
          status: 'draft',
          text: "Three years ago I thought AI agents were science fiction. Today I'm deploying them daily. The shift wasn't in the technology—it was in learning to think in systems rather than scripts.\n\nWhat changed your perspective on AI?",
        },
        {
          accountId: account.id,
          platform: 'twitter',
          postType: 'reaction',
          status: 'draft',
          text: 'Fascinating thread on LLM reasoning. The key insight: chain-of-thought isn\'t just a trick—it\'s exposing the actual computation happening. We\'re watching models "think out loud" and it\'s telling us a lot about how they work.',
        },
      ],
    });
    console.log('Created 3 sample draft posts');
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
