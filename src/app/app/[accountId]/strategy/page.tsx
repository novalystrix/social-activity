export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma';
import CorpusStrategyUI from '@/components/CorpusStrategyUI';

interface Props {
  params: Promise<{ accountId: string }>;
}

export default async function StrategyPage({ params }: Props) {
  const { accountId } = await params;

  const items = await prisma.strategy.findMany({
    where: { accountId },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Strategy Files</h1>
      <CorpusStrategyUI
        accountId={accountId}
        type="strategy"
        initialItems={items.map((i) => ({
          id: i.id,
          filename: i.filename,
          title: i.title,
          content: i.content,
          updatedAt: i.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
