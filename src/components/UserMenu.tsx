'use client';

import { useSession, signOut } from 'next-auth/react';

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse" />;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {session.user.image && (
        <img
          src={session.user.image}
          alt={session.user.name ?? 'User'}
          className="h-8 w-8 rounded-full"
        />
      )}
      <div className="hidden sm:block text-sm">
        <p className="text-white font-medium leading-tight">{session.user.name}</p>
        <p className="text-gray-400 text-xs leading-tight">{session.user.email}</p>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}