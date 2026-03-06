'use client';

import { signOut } from 'next-auth/react';

interface Props {
  userEmail: string | null | undefined;
  userName: string | null | undefined;
  userImage: string | null | undefined;
}

export default function AccountsClient({ userEmail, userName, userImage }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-zinc-400">{userName || userEmail}</span>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
