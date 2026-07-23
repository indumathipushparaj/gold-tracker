'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type PurchaseRecord = {
  id: string;
  carat: number;
  weightInGrams: number;
  totalPaid: number;
  purchaseDate: Date;
};

export default function PurchasesTable({ purchases }: { purchases: PurchaseRecord[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Delete this purchase? This cannot be undone.');
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/purchases?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Purchase deleted');
        router.refresh(); // re-fetches server data without a full page reload
      } else {
        toast.error('Failed to delete purchase');
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-700 text-gray-400 text-left">
          <th className="px-4 py-3 font-medium">Date</th>
          <th className="px-4 py-3 font-medium">Carat</th>
          <th className="px-4 py-3 font-medium">Weight (g)</th>
          <th className="px-4 py-3 font-medium">Paid (₹)</th>
          <th className="px-4 py-3 font-medium text-right"></th>
        </tr>
      </thead>
      <tbody>
        {purchases.length === 0 ? (
          <tr>
            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
              No purchases yet. Add your first one.
            </td>
          </tr>
        ) : (
          purchases.map((purchase) => (
            <tr key={purchase.id} className="border-b border-gray-800 text-white hover:bg-white/5">
              <td className="px-4 py-3">
                {new Date(purchase.purchaseDate).toLocaleDateString('en-IN')}
              </td>
              <td className="px-4 py-3">{purchase.carat}K</td>
              <td className="px-4 py-3">{purchase.weightInGrams}</td>
              <td className="px-4 py-3">{purchase.totalPaid.toFixed(2)}</td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => handleDelete(purchase.id)}
                  disabled={deletingId === purchase.id}
                  className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                  {deletingId === purchase.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}