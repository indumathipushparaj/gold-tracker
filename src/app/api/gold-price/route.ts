import { NextResponse } from 'next/server';
import { getGoldPrices } from '@/lib/goldPrice';

export async function GET() {
  const prices = await getGoldPrices();

  if (!prices) {
    return NextResponse.json({ error: 'Failed to fetch gold price' }, { status: 500 });
  }

  return NextResponse.json(prices);
}