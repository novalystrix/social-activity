export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma';
import JournalUI from '@/components/JournalUI';

interface Props {
  params: Promise<{ accountId: string }>;
}

export default async function JournalPage({ params }: Props) {
  const { accountId } = await params;

  const entries = await prisma.journalEntry.findMany({
    where: { accountId },
    orderBy: { date: 'desc' },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Journal</h1>
      <JournalUI
        accountId={accountId}
        initialEntries={entries.map((e) => ({
          id: e.id,
          type: e.type,
          date: e.date,
          content: e.content,
          updatedAt: e.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
