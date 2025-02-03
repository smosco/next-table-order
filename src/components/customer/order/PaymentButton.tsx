import { useState } from 'react';

export function PaymentButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    if (!orderId) return alert('Order not found.');

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, paymentMethod: 'card' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handlePayment} disabled={loading || success}>
        {loading ? 'Processing...' : success ? 'Payment Completed' : 'Pay Now'}
      </button>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
}
