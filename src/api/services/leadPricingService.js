import { axiosAdmin } from '../axios/config';
import { calculateLeadPrice } from '../../utils/leadPricing';

export const getLeadPricing = async () => {
  try {
    // Try to fetch from backend
    const res = await axiosAdmin.get('/settings/lead-pricing');
    return res.data.pricing;
  } catch (error) {
    // If API call fails, use the same data structure as backend
    return {
      subscriber: {
        home: 20.50,
        auto: 20.50,
        mortgage: 20.50,
      },
      startup: {
        home: 20.50,
        auto: 20.50,
        mortgage: 20.50,
      },
      agency: {
        home: 20.50,
        auto: 20.50,
        mortgage: 20.50,
      }
    };
  }
};

export const updateLeadPricing = async (pricing) => {
  console.log('Updating lead pricing with data:', pricing);
  try {
    const res = await axiosAdmin.put('/settings/lead-pricing', { pricing });
    console.log('Lead pricing update response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Failed to update lead pricing:', error);
    throw error;
  }
};
