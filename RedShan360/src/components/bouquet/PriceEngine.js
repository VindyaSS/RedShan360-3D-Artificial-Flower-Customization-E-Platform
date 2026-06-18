/**
 * PriceEngine.js
 * Computes the estimated total price for custom bouquet configurations.
 */

export const BASE_PRICES = {
  vase: 45.00,        // Crystal Vase base
  wrapping: {
    'kraft-paper': 4.00,
    default: 0.00
  },
  ribbon: {
    'velvet-ribbon': 7.00,
    default: 0.00
  }
};

/**
 * Calculates the total cost of a customized bouquet.
 * 
 * @param {Array} selectedStems - Array of { stemId, quantity }
 * @param {Array} stemsDatabase - The database of stem item definitions
 * @param {string} wrappingId - ID of selected wrapping
 * @param {string} ribbonId - ID of selected ribbon
 * @returns {object} { basePrice, flowersPrice, wrappingPrice, ribbonPrice, total }
 */
export function calculateBouquetPrice(selectedStems = [], stemsDatabase = [], wrappingId = null, ribbonId = null) {
  const basePrice = BASE_PRICES.vase;
  
  // Calculate flowers cost
  const flowersPrice = selectedStems.reduce((sum, item) => {
    const dbItem = stemsDatabase.find(s => s.id === item.stemId);
    const unitPrice = dbItem ? dbItem.price : 0.00;
    return sum + (unitPrice * item.quantity);
  }, 0);

  // Calculate wrapping cost
  const wrappingPrice = BASE_PRICES.wrapping[wrappingId] || 0.00;

  // Calculate ribbon cost
  const ribbonPrice = BASE_PRICES.ribbon[ribbonId] || 0.00;

  const total = basePrice + flowersPrice + wrappingPrice + ribbonPrice;

  return {
    basePrice,
    flowersPrice,
    wrappingPrice,
    ribbonPrice,
    total
  };
}
