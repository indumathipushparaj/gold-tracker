import { prisma } from '@/lib/prisma';
import { getGoldPrices } from '@/lib/goldPrice';
import PurchasesTable from '@/components/PurchasesTable';

export default async function PurchasesPage() {
  const purchases = await prisma.purchase.findMany({
    orderBy: { purchaseDate: 'desc' },
  });

  const goldPrice = await getGoldPrices();

  let totalInvested = 0;
  let totalCurrentValue = 0;

  const purchasesWithPL = purchases.map((purchase) => {
    const currentPricePerGram =
      purchase.carat === 24 ? goldPrice?.price24k : goldPrice?.price22k;

    const currentValue = currentPricePerGram
      ? purchase.weightInGrams * currentPricePerGram
      : null;

    const profitLoss = currentValue !== null ? currentValue - purchase.totalPaid : null;
    const profitLossPercent =
      profitLoss !== null ? (profitLoss / purchase.totalPaid) * 100 : null;

    totalInvested += purchase.totalPaid;
    if (currentValue !== null) totalCurrentValue += currentValue;

    return { ...purchase, currentValue, profitLoss, profitLossPercent };
  });

  const totalProfitLoss = totalCurrentValue - totalInvested;
  const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  return (
    <div className="min-h-screen bg-[rgb(20,24,30)] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'rgb(252,213,53)' }}>
          Your Gold Purchases
        </h1>

        {!goldPrice && (
          <div className="mb-4 rounded-lg bg-red-900/30 border border-red-700 px-4 py-3 text-sm text-red-300">
            Couldn't fetch live gold price right now. Showing your purchase history without current values.
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl p-4" style={{ backgroundColor: 'rgb(32,38,48)' }}>
            <p className="text-xs text-gray-400 mb-1">Total Invested</p>
            <p className="text-lg font-semibold text-white">₹{totalInvested.toFixed(2)}</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: 'rgb(32,38,48)' }}>
            <p className="text-xs text-gray-400 mb-1">Current Value</p>
            <p className="text-lg font-semibold text-white">₹{totalCurrentValue.toFixed(2)}</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: 'rgb(32,38,48)' }}>
            <p className="text-xs text-gray-400 mb-1">Profit / Loss</p>
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
          <PurchasesTable purchases={purchasesWithPL} />
        </div>
      </div>
    </div>
  );
}