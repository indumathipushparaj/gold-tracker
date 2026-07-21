import Link from 'next/link';
import AddPurchaseForm from '@/components/AddPurchaseForm';

export default function Home() {
  return (
    <div>
      <AddPurchaseForm />
      <div className="text-center pb-10 bg-[rgb(20,24,30)]">
        <Link
          href="/purchases"
          className="text-sm hover:underline"
          style={{ color: 'rgb(252,213,53)' }}
        >
          View all purchases →
        </Link>
      </div>
    </div>
  );
}