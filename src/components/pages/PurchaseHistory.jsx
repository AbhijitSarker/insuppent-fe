import React from 'react';
import { usePurchaseHistory } from '@/api/hooks/usePurchase';
import MaterialIcon from '@/components/ui/MaterialIcon';

const PurchaseHistory = () => {
  const { data, isLoading, error } = usePurchaseHistory();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Failed to load purchase history</div>;
  const purchases = data?.data || [];
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <MaterialIcon icon="history" size={20} /> Purchase History
      </h2>
      <table className="w-full border rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Date</th>
            <th className="p-2">Name</th>
            <th className="p-2">Type</th>
            <th className="p-2">State</th>
            <th className="p-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{new Date(p.purchasedAt).toLocaleString()}</td>
              <td className="p-2">{p.Lead?.name}</td>
              <td className="p-2">{p.Lead?.type}</td>
              <td className="p-2">{p.Lead?.state}</td>
              <td className="p-2">${p.Lead?.price?.toFixed(2) ?? '--'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {purchases.length === 0 && <div className="text-gray-500 mt-4">No purchases yet.</div>}
    </div>
  );
};

export default PurchaseHistory;
