import React, { useMemo, useState } from 'react';
import { createCheckoutSession } from '@/api/services/purchaseService';
import Button from '@/components/ui/button';


const CheckoutPage = ({ leads, onCancel }) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const total = useMemo(() => leads.reduce((sum, l) => sum + (l.price || 0), 0), [leads]);

  const handleConfirm = async () => {
    setError('');
    setIsLoading(true);
    try {
      const data = await createCheckoutSession(leads.map(l => l.id));
      window.location.href = data.url;
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to start checkout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <ul className="mb-4">
        {leads.map(lead => (
          <li key={lead.id} className="flex justify-between border-b py-2">
            <span>{lead.name} ({lead.type})</span>
            <span>${lead.price?.toFixed(2) ?? '--'}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between font-semibold text-lg mb-4">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="flex gap-2">
        <Button onClick={handleConfirm} loading={isLoading} className="w-full">Pay with Card</Button>
        <Button onClick={onCancel} variant="outline" className="w-full">Cancel</Button>
      </div>
    </div>
  );
};

export default CheckoutPage;
