/**
 * Frontend utility for lead pricing calculations
 * This matches the backend implementation
 */

// Default pricing (should match the backend default)
const defaultPricing = {
  Subscriber: {
    auto: 20.50,
    home: 20.50,
    mortgage: 20.50,
  },
  Startup: {
    auto: 20.50,
    home: 20.50,
    mortgage: 20.50,
  },
  Agency: {
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

  // Normalize inputs for case-insensitive comparison
  const normalizedLevel = String(memberLevel).charAt(0).toUpperCase() + String(memberLevel).slice(1).toLowerCase();
  const normalizedType = String(leadType).toLowerCase();

  if (!pricing[normalizedLevel] || !pricing[normalizedLevel][normalizedType]) {
    console.warn(`Price not found for ${normalizedLevel} - ${normalizedType}`);
    return null;
  }
  return parseFloat(pricing[normalizedLevel][normalizedType]);
};
