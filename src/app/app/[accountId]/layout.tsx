import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import AppSidebar from '@/components/AppSidebar';

interface Props {
  children: React.ReactNode;
  params: Promise<{ accountId: string }>;
}

export default async function AccountLayout({ children, params }: Props) {
  const { accountId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      memberships: {
        include: { account: true },
      },
    },
  });

  if (!user) redirect('/login');

  const membership = user.memberships.find((m) => m.accountId === accountId);
  if (!membership) redirect('/accounts');

  const allAccounts = user.memberships.map((m) => ({
    id: m.account.id,
    name: m.account.name,
  }));

  return (
    <div className="flex min-h-screen">
      <AppSidebar
        accountId={accountId}
        accountName={membership.account.name}
        accounts={allAccounts}
        userName={session.user.name}
        userImage={session.user.image}
      />
      <main className="ml-56 flex-1 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
