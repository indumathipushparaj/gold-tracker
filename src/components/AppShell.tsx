import Image from 'next/image';
import Link from 'next/link';

import logo from '@/assets/gold-tracker-logo.png';
import { getGoldPrices } from '@/lib/goldPrice';
import UserMenu from '@/components/UserMenu';

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const goldPrices = await getGoldPrices();

  return (
    <div className="min-h-screen flex flex-col bg-[rgb(20,24,30)] text-white">
      <header
        className="sticky top-0 z-20 border-b backdrop-blur-sm"
        style={{
          borderColor: 'rgba(252,213,53,0.22)',
          backgroundColor: 'rgba(24,28,36,0.92)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.24)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3" aria-label="Go to home page">
            <div className="rounded-full p-1 ring-1 ring-[rgba(252,213,53,0.35)] bg-[rgba(252,213,53,0.12)]">
              <Image
                src={logo}
                alt="Gold Tracker logo"
                width={34}
                height={34}
                className="rounded-full"
                priority
              />
            </div>
            <span className="text-lg font-semibold tracking-wide" style={{ color: 'rgb(252,213,53)' }}>
              gold-tracker
            </span>
          </Link>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="flex flex-wrap items-center justify-end gap-2 text-[11px] sm:text-xs font-semibold">
              <div className="rounded-full border px-2.5 py-1.5 sm:px-3" style={{ borderColor: 'rgba(252,213,53,0.35)', backgroundColor: 'rgba(252,213,53,0.08)' }}>
                <span className="text-gray-300">22K (916)</span>
                <span className="ml-1" style={{ color: 'rgb(252,213,53)' }}>
                  ₹{goldPrices?.price22k?.toFixed(2) ?? '—'}
                </span>
              </div>
              <div className="rounded-full border px-2.5 py-1.5 sm:px-3" style={{ borderColor: 'rgba(252,213,53,0.35)', backgroundColor: 'rgba(252,213,53,0.08)' }}>
                <span className="text-gray-300">24K (999)</span>
                <span className="ml-1" style={{ color: 'rgb(252,213,53)' }}>
                  ₹{goldPrices?.price24k?.toFixed(2) ?? '—'}
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-white/10" />

            <UserMenu />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-4">{children}</main>

      <footer
        className="border-t px-4 py-3 text-center text-[11px] font-medium uppercase tracking-[0.24em]"
        style={{
          borderColor: 'rgba(252,213,53,0.22)',
          color: 'rgb(182,189,199)',
          backgroundColor: 'rgba(24,28,36,0.7)',
        }}
      >
        gold-tracker • keep your purchases in view
      </footer>
    </div>
  );
}