/**
 * Frontend utility for lead pricing calculations
 * This matches the backend implementation
 */

// Default pricing (should match the backend default)
const defaultPricing = {
  subscriber: {
    auto: 20.50,
    home: 20.50,
    mortgage: 20.50,
  },
  startup: {
    auto: 20.50,
    home: 20.50,
    mortgage: 20.50,
  },
  agency: {
    auto: 20.50,
    home: 20.50,
    mortgage: 20.50,
  }
};

// Cache the pricing data
let cachedPricing = null;

/**
 * Set pricing data in cache
 * @param {Object} pricing 
 */
export const setPricingData = (pricing) => {
  cachedPricing = pricing;
};

/**
 * Get pricing data from cache or default
 * @returns {Object} pricing data
 */
export const getPricingData = () => {
  return cachedPricing || defaultPricing;
};

/**
 * Calculate lead price based on membership level and lead type
 * @param {string} memberLevel - 'subscriber', 'startup', or 'agency'
 * @param {string} leadType - 'auto', 'home', or 'mortgage'
 * @returns {number|null} price or null if not found
 */
export const calculateLeadPrice = (memberLevel, leadType) => {
  const pricing = getPricingData();

  const normalizedLevel = String(memberLevel).toLowerCase();
  const normalizedType = String(leadType).toLowerCase();

  if (!pricing[normalizedLevel] || !pricing[normalizedLevel][normalizedType]) {
    return null;
  }
  return pricing[normalizedLevel][normalizedType];
};
