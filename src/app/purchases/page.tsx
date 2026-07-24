export const dynamic = 'force-dynamic';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getGoldPrices } from '@/lib/goldPrice';
import PurchasesTable from '@/components/PurchasesTable';
import Link from 'next/link';


export default async function PurchasesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null; // proxy.ts should already redirect before this ever renders
  }

  const purchases = await prisma.purchase.findMany({
    where: { userId: session.user.id },
    orderBy: { purchaseDate: 'desc' },
  });

  const goldPrice = await getGoldPrices();

  const totalInvested = purchases.reduce((sum, purchase) => sum + purchase.totalPaid, 0);

  const totalCurrentValue = purchases.reduce((sum, purchase) => {
    const currentPricePerGram =
      purchase.carat === 24 ? goldPrice?.price24k : goldPrice?.price22k;

    if (!currentPricePerGram) {
      return sum;
    }

    return sum + purchase.weightInGrams * currentPricePerGram;
  }, 0);

  const totalProfitLoss = totalCurrentValue - totalInvested;
  const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  const purchasesForTable = purchases.map(({ id, carat, weightInGrams, totalPaid, purchaseDate }) => ({
    id,
    carat,
    weightInGrams,
    totalPaid,
    purchaseDate,
  }));

  return (
    <div className="min-h-screen bg-[rgb(20,24,30)] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'rgb(252,213,53)' }}>
          Your Gold Purchases
        </h1>

        {!goldPrice && (
          <div className="mb-4 rounded-lg bg-red-900/30 border border-red-700 px-4 py-3 text-sm text-red-300">
            Couldn&apos;t fetch live gold price right now. Showing your purchase history without current values.
          </div>
        )}

        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'rgb(252,213,53)', color: 'rgb(20,24,30)' }}
          >
            ← Back
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl p-4" style={{ backgroundColor: 'rgb(32,38,48)' }}>
            <p className="text-xs text-gray-400 mb-1">Total Invested</p>
            <p className="text-lg font-semibold text-white">₹{totalInvested.toFixed(2)}</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: 'rgb(32,38,48)' }}>
            <p className="text-xs text-gray-400 mb-1">Overall Profit / Loss</p>
            <p
              className="text-lg font-semibold"
              style={{ color: totalProfitLoss >= 0 ? '#4ade80' : '#f87171' }}
            >
              {totalProfitLoss >= 0 ? '+' : ''}₹{totalProfitLoss.toFixed(2)} (
              {totalProfitLossPercent.toFixed(2)}%)
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: 'rgb(32,38,48)',
            boxShadow: '0 0 40px rgba(252,213,53,0.08), 0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <PurchasesTable purchases={purchasesForTable} />
        </div>
      </div>
    </div>
  );
}