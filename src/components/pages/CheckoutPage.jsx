import React, { useMemo, useState } from 'react';
import { createCheckoutSession } from '@/api/services/purchaseService';
import Button from '@/components/ui/button';
import { Badge } from '../ui/badge';


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
    <div className="max-w-lg w-full bg-white rounded-2xl shadow p-4 sm:p-8 mx-4">
      <h2 className="md:text-xl text-base leading-7 font-semibold  mb-6">Checkout</h2>
      <div className="rounded-xl border border-borderColor-primary bg-bg-secondary mb-6">
        <ul className="divide-y divide-borderColor-primary px-4">
          {leads.map(lead => {
            // Map lead type to badge variant and icon
            let badgeVariant = 'auto';
            let badgeIcon = 'auto';
            let badgeLabel = lead.type;
            if (lead.type.toLowerCase().includes('home')) {
              badgeVariant = 'home';
              badgeIcon = 'home';
            } else if (lead.type.toLowerCase().includes('mortgage')) {
              badgeVariant = 'mortgage';
              badgeIcon = 'mortgage';
            } else if (lead.type.toLowerCase().includes('auto')) {
              badgeVariant = 'auto';
              badgeIcon = 'auto';
            } else if (lead.type.toLowerCase().includes('life')) {
              // Not in badgeVariants, fallback to pink
              badgeVariant = undefined;
              badgeIcon = undefined;
            }
            return (
              <li key={lead.id} className="flex items-center justify-between py-3  md:text-sm text-xs bg-transparent gap-2">
                <div className="flex items-center min-w-0 gap-4">
                  <span className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-[180px]">{lead.name}</span>
                  <span>
                    <Badge variant={badgeVariant} icon={badgeIcon}>
                      {badgeLabel.charAt(0).toUpperCase() + badgeLabel.slice(1)}
                    </Badge>
                  </span>
                </div>
                <span className="text-gray-900 font-medium text-right min-w-[70px]">${lead.price?.toFixed(2) ?? '--'}</span>
              </li>
            );
          })}
        </ul>
        <div className="flex justify-between items-center px-2 sm:px-6 py-2 mx-4 border-t border-borderColor-primary  md:text-sm text-xs">
          <span className="font-bold text-lg">Total:</span>
          <span className="font-bold text-lg text-gray-900">${total.toFixed(2)}</span>
        </div>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="flex flex-col justify-end sm:flex-row gap-2">
        <Button onClick={onCancel} variant="outline" className="!bg-bg-tertiary border-none">Cancel</Button>
        <Button onClick={handleConfirm} loading={isLoading} className={`bg-bg-brand border-blue-500 px-3 py-2  rounded-lg text-white text-sm font-semibold leading-5 flex items-center justify-center min-w-[90px]`}>Buy Now</Button>
      </div>
    </div>
  );
};

export default CheckoutPage;
