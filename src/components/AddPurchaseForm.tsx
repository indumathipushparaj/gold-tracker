'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const purchaseSchema = z.object({
  carat: z.enum(['22', '24']),
  weightInGrams: z.coerce.number().positive('Weight must be greater than 0'),
  totalPaid: z.coerce.number().positive('Total paid must be greater than 0'),
  pricePerGram: z.coerce.number().positive('Price per gram must be greater than 0'),
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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PurchaseFormInput, unknown, PurchaseFormOutput>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      carat: '24',
      purchaseDate: new Date().toISOString().split('T')[0],
      pricePerGram: 0,
    },
  });

  const weight = Number(watch('weightInGrams') || 0);
  const totalPaid = Number(watch('totalPaid') || 0);
  const computedPricePerGram = weight > 0 && totalPaid > 0 ? totalPaid / weight : 0;

  useEffect(() => {
    setValue('pricePerGram', computedPricePerGram, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [computedPricePerGram, setValue]);

  const onSubmit = async (data: PurchaseFormOutput) => {
    const pricePerGram = weight > 0 && totalPaid > 0 ? totalPaid / weight : 0;

    const res = await fetch('/api/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        carat: Number(data.carat),
        totalPaid: Number(data.totalPaid),
        pricePerGram,
      }),
    });

    if (res.ok) {
      reset();
      toast.success('Purchase added successfully');
    } else {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="w-full flex items-center justify-center bg-[rgb(20,24,30)]">
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          backgroundColor: 'rgb(32,38,48)',
          boxShadow: '0 0 35px rgba(252,213,53,0.08), 0 8px 24px rgba(0,0,0,0.38)',
        }}
      >
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'rgb(252,213,53)' }}>
          Add Gold Purchase
        </h1>
        <p className="text-sm text-gray-400 mb-4">
          Log a new gold purchase to track its value over time
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Carat
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['22', '24'] as const).map((value) => (
                <label
                  key={value}
                  className="cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-medium transition-colors"
                  style={{
                    borderColor: watch('carat') === value ? 'rgb(252,213,53)' : 'rgb(75,85,99)',
                    backgroundColor: watch('carat') === value ? 'rgba(252,213,53,0.1)' : 'rgb(24,28,36)',
                    color: watch('carat') === value ? 'rgb(252,213,53)' : 'white',
                  }}
                >
                  <input
                    type="radio"
                    value={value}
                    {...register('carat')}
                    className="sr-only"
                  />
                  {value} Carat
                </label>
              ))}
            </div>
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
              className="w-full rounded-lg bg-[rgb(24,28,36)] border border-gray-700 text-white px-3 py-1.5 focus:outline-none focus:ring-2 placeholder-gray-500"
              style={{ '--tw-ring-color': 'rgb(252,213,53)' } as React.CSSProperties}
            />
            {errors.weightInGrams && (
              <p className="text-red-400 text-xs mt-1">{errors.weightInGrams.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Total paid */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Total Paid (₹)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 33000"
                {...register('totalPaid')}
                className="w-full rounded-lg bg-[rgb(24,28,36)] border border-gray-700 text-white px-3 py-1.5 focus:outline-none focus:ring-2 placeholder-gray-500"
                style={{ '--tw-ring-color': 'rgb(252,213,53)' } as React.CSSProperties}
              />
              {errors.totalPaid && (
                <p className="text-red-400 text-xs mt-1">{errors.totalPaid.message}</p>
              )}
            </div>

            {/* Price per gram (calculated display) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Price per gram (₹)
              </label>
              <div className="w-full rounded-lg bg-[rgb(24,28,36)] border border-gray-700 px-3 py-1.5 text-white">
                <span className="font-semibold" style={{ color: 'rgb(252,213,53)' }}>
                  ₹{computedPricePerGram.toFixed(2)}
                </span>
              </div>
              <input type="hidden" {...register('pricePerGram')} />
            </div>
          </div>

          {/* Purchase date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Purchase Date
            </label>
            <input
              type="date"
              {...register('purchaseDate')}
              className="w-full rounded-lg bg-[rgb(24,28,36)] border border-gray-700 text-white px-3 py-1.5 focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'rgb(252,213,53)' } as React.CSSProperties}
            />
            {errors.purchaseDate && (
              <p className="text-red-400 text-xs mt-1">{errors.purchaseDate.message}</p>
            )}
          </div>

          <button
  type="submit"
  disabled={isSubmitting}
  className="w-full rounded-lg py-2.5 font-semibold transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
  style={{ backgroundColor: 'rgb(252,213,53)', color: 'rgb(20,24,30)' }}
>
  {isSubmitting && (
    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  )}
  {isSubmitting ? 'Saving...' : 'Add Purchase'}
</button>
        </form>
      </div>
    </div>
  );
}