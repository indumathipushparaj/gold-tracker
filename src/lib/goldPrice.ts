const GOLD_API_KEY = process.env.GOLD_API_KEY;
const GOLD_API_URL = 'https://www.goldapi.io/api/XAU/INR';

export async function getGoldPrices() {
  try {
    const res = await fetch(GOLD_API_URL, {
      headers: {
        'x-access-token': GOLD_API_KEY!,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch gold price');
    }

    const data = await res.json();
    const pricePer24kGram = data.price_gram_24k;
    const pricePer22kGram = data.price_gram_22k;

    return {
      price24k: pricePer24kGram,
      price22k: pricePer22kGram,
      timestamp: data.timestamp,
    };
  } catch (error) {
    console.error('Error fetching gold price:', error);
    return null;
  }
}