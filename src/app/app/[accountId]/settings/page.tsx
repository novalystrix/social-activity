export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma';
import SettingsUI from './SettingsUI';

interface Props {
  params: Promise<{ accountId: string }>;
}

export default async function SettingsPage({ params }: Props) {
  const { accountId } = await params;

  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: {
      members: {
        include: { user: { select: { id: true, email: true, name: true, image: true } } },
      },
    },
  });

  if (!account) return <div className="text-zinc-500">Account not found</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      <SettingsUI
        accountId={accountId}
        initialAccount={{
          id: account.id,
          name: account.name,
          slug: account.slug,
          botName: account.botName,
          botAvatar: account.botAvatar,
          webhookUrl: account.webhookUrl,
        }}
        initialMembers={account.members.map((m) => ({
          id: m.id,
          role: m.role,
          user: m.user,
        }))}
      />
    </div>
  );
}
