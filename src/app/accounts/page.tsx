import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { signOut } from 'next-auth/react';
import AccountsClient from './AccountsClient';

export default async function AccountsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      memberships: {
        include: { account: true },
        orderBy: { account: { createdAt: 'asc' } },
      },
    },
  });

  const accounts = user?.memberships.map((m) => ({
    id: m.account.id,
    name: m.account.name,
    slug: m.account.slug,
    role: m.role,
  })) || [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between max-w-3xl mx-auto">
        <div className="text-lg font-bold">
          Social <span className="text-[#4FC3F7]">Activity</span>
        </div>
        <AccountsClient userEmail={session.user.email} userName={session.user.name} userImage={session.user.image} />
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">Your Accounts</h1>
        <p className="text-zinc-400 text-sm mb-8">Select an account to continue</p>

        {accounts.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-zinc-800 bg-[#1a1a2e]">
            <p className="text-zinc-400 mb-4">You don&apos;t belong to any accounts yet.</p>
            <Link
              href="/accounts/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4FC3F7] text-black font-medium rounded-lg hover:bg-[#4FC3F7]/90 transition-colors"
            >
              Create Account
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <Link
                key={account.id}
                href={`/app/${account.id}`}
                className="flex items-center justify-between p-5 rounded-xl border border-zinc-800 bg-[#1a1a2e] hover:border-[#4FC3F7]/40 hover:bg-[#1a1a2e]/80 transition-all group"
              >
                <div>
                  <h2 className="font-semibold text-white group-hover:text-[#4FC3F7] transition-colors">{account.name}</h2>
                  <p className="text-sm text-zinc-500 mt-0.5">@{account.slug} &middot; {account.role}</p>
                </div>
                <svg className="w-5 h-5 text-zinc-600 group-hover:text-[#4FC3F7] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}

            <Link
              href="/accounts/new"
              className="flex items-center justify-center gap-2 p-5 rounded-xl border border-dashed border-zinc-700 text-zinc-500 hover:border-[#4FC3F7]/40 hover:text-[#4FC3F7] transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create new account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
