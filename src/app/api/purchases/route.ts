import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createPurchaseSchema = z.object({
  carat: z.number().int().refine((val) => val === 22 || val === 24, {
    message: 'Carat must be 22 or 24',
  }),
  weightInGrams: z.number().positive(),
  pricePerGram: z.number().positive(),
  totalPaid: z.number().positive(),
  purchaseDate: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = createPurchaseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { carat, weightInGrams, pricePerGram, totalPaid, purchaseDate } = parsed.data;

    const purchase = await prisma.purchase.create({
      data: {
        carat,
        weightInGrams,
        pricePerGram,
        totalPaid,
        purchaseDate: new Date(purchaseDate),
      },
    });

    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase:', error);
    return NextResponse.json(
      { error: 'Failed to create purchase' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const purchases = await prisma.purchase.findMany({
      orderBy: { purchaseDate: 'desc' },
    });
    return NextResponse.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing purchase id' }, { status: 400 });
    }

    await prisma.purchase.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting purchase:', error);
    return NextResponse.json({ error: 'Failed to delete purchase' }, { status: 500 });
  }
}