import prisma from '@/lib/prisma';
import ChatUI from './ChatUI';

interface Props {
  params: Promise<{ accountId: string }>;
}

export default async function ChatPage({ params }: Props) {
  const { accountId } = await params;

  const messages = await prisma.chatMessage.findMany({
    where: { accountId },
    orderBy: { createdAt: 'asc' },
    take: 100,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Team Chat</h1>
      <ChatUI
        accountId={accountId}
        initialMessages={messages.map((m) => ({
          id: m.id,
          authorName: m.authorName,
          authorImage: m.authorImage,
          isBot: m.isBot,
          text: m.text,
          pinnedItem: m.pinnedItem,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
