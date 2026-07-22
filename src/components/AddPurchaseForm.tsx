'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const purchaseSchema = z.object({
  carat: z.enum(['22', '24']),
  weightInGrams: z.coerce.number().positive('Weight must be greater than 0'),
  pricePerGram: z.coerce.number().positive('Price must be greater than 0'),
  purchaseDate: z.string().min(1, 'Date is required'),
});

type PurchaseFormInput = z.input<typeof purchaseSchema>;
type PurchaseFormOutput = z.output<typeof purchaseSchema>;



export default function AddPurchaseForm() {
  const {
  register,
  handleSubmit,
  watch,
  reset,
  formState: { errors, isSubmitting },
} = useForm<PurchaseFormInput, any, PurchaseFormOutput>({
  resolver: zodResolver(purchaseSchema),
  defaultValues: {
    carat: '24',
    purchaseDate: new Date().toISOString().split('T')[0],
  },
});

  const weight = watch('weightInGrams');
  const price = watch('pricePerGram');
  const total = weight && price ? (Number(weight) * Number(price)).toFixed(2) : '0.00';

const onSubmit = async (data: PurchaseFormOutput) => {
  const res = await fetch('/api/purchases', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      carat: Number(data.carat),
      totalPaid: Number(total),
    }),
  });

  if (res.ok) {
    reset();
    alert('Purchase added successfully');
  } else {
    alert('Something went wrong');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(20,24,30)] px-4">
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          backgroundColor: 'rgb(32,38,48)',
          boxShadow: '0 0 40px rgba(252,213,53,0.08), 0 8px 24px rgba(0,0,0,0.4)',
        }}
      >
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: 'rgb(252,213,53)' }}
        >
          Add Gold Purchase
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Log a new gold purchase to track its value over time
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Carat */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Carat
            </label>
            <select
              {...register('carat')}
              className="w-full rounded-lg bg-[rgb(24,28,36)] border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'rgb(252,213,53)' } as React.CSSProperties}
            >
              <option value="22">22 Carat</option>
              <option value="24">24 Carat</option>
            </select>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Weight (grams)
            </label>
            <input
              type="number"
              step="0.001"
              placeholder="e.g. 5.5"
              {...register('weightInGrams')}
              className="w-full rounded-lg bg-[rgb(24,28,36)] border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 placeholder-gray-500"
              style={{ '--tw-ring-color': 'rgb(252,213,53)' } as React.CSSProperties}
            />
            {errors.weightInGrams && (
              <p className="text-red-400 text-xs mt-1">{errors.weightInGrams.message}</p>
            )}
          </div>

          {/* Price per gram */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Price per gram (₹)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 6200"
              {...register('pricePerGram')}
              className="w-full rounded-lg bg-[rgb(24,28,36)] border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 placeholder-gray-500"
              style={{ '--tw-ring-color': 'rgb(252,213,53)' } as React.CSSProperties}
            />
            {errors.pricePerGram && (
              <p className="text-red-400 text-xs mt-1">{errors.pricePerGram.message}</p>
            )}
          </div>

          {/* Purchase date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Purchase Date
            </label>
            <input
              type="date"
              {...register('purchaseDate')}
              className="w-full rounded-lg bg-[rgb(24,28,36)] border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'rgb(252,213,53)' } as React.CSSProperties}
            />
            {errors.purchaseDate && (
              <p className="text-red-400 text-xs mt-1">{errors.purchaseDate.message}</p>
            )}
          </div>

          {/* Total (calculated, read-only display) */}
          <div className="rounded-lg bg-[rgb(24,28,36)] border border-gray-700 px-3 py-2 flex justify-between items-center">
            <span className="text-sm text-gray-400">Total Paid</span>
            <span className="font-semibold" style={{ color: 'rgb(252,213,53)' }}>
              ₹{total}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg py-2.5 font-semibold transition-opacity disabled:opacity-50"
            style={{ backgroundColor: 'rgb(252,213,53)', color: 'rgb(20,24,30)' }}
          >
            {isSubmitting ? 'Saving...' : 'Add Purchase'}
          </button>
        </form>
      </div>
    </div>
  );
}