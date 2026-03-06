export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma';
import PersonalityUI from './PersonalityUI';

interface Props {
  params: Promise<{ accountId: string }>;
}

export default async function PersonalityPage({ params }: Props) {
  const { accountId } = await params;

  const items = await prisma.personality.findMany({
    where: { accountId },
    orderBy: [{ platform: 'asc' }, { section: 'asc' }],
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Social Personality</h1>
        <p className="text-sm text-zinc-400 mt-1">Define the voice, style, and behavior for each platform.</p>
      </div>
      <PersonalityUI
        accountId={accountId}
        initialItems={items.map((i) => ({
          id: i.id,
          section: i.section,
          platform: i.platform as 'all' | 'linkedin' | 'twitter',
          content: i.content,
          updatedAt: i.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
