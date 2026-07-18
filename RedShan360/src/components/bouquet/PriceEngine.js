/**
 * PriceEngine.js
 * Computes the estimated total price for custom bouquet configurations dynamically.
 */

export const BASE_SERVICE_CHARGE = 500;

/**
 * Centrally rounds numeric currency calculations to 2 decimal places.
 * 
 * @param {number|string} value - The input value to round
 * @returns {number} Rounded value
 */
export const roundCurrency = value =>
  Math.round((Number(value) + Number.EPSILON) * 100) / 100;

/**
 * Calculates the raw subtotal for selected premium bloom flowers from database prices.
 * 
 * @param {Array} selectedStems - Selected stem options list
 * @param {Array} stemsDatabase - The database catalog of stems
 * @returns {number} Total flower subtotal
 */
export function calculateFlowerSubtotal(selectedStems = [], stemsDatabase = []) {
  let subtotal = 0;
  selectedStems.forEach(item => {
    const dbItem = stemsDatabase.find(s => String(s.id) === String(item.stemId));
    if (dbItem && dbItem.category === 'premium-blooms') {
      const rawPrice = Number(dbItem.price);
      const price = isFinite(rawPrice) && rawPrice > 0 ? rawPrice : 0;
      subtotal += price * (Number(item.quantity) || 0);
    }
  });
  return roundCurrency(subtotal);
}

/**
 * Calculates the scaled flower subtotal based on the size multiplier.
 * 
 * @param {number} flowerSubtotal - Raw flower subtotal
 * @param {number} priceMultiplier - Size multiplier
 * @returns {number} Scaled flower total
 */
export function calculateScaledFlowerTotal(flowerSubtotal, priceMultiplier) {
  const rawMult = Number(priceMultiplier);
  const multiplier = isFinite(rawMult) && rawMult > 0 ? rawMult : 1.0;
  return roundCurrency(flowerSubtotal * multiplier);
}

/**
 * Calculates the final grand total.
 * 
 * @param {number} scaledFlowerTotal - Scaled flower total
 * @param {number} serviceCharge - Service charge
 * @returns {number} Final grand total
 */
export function calculateGrandTotal(scaledFlowerTotal, serviceCharge) {
  return roundCurrency(scaledFlowerTotal + serviceCharge);
}

/**
 * Computes the complete pricing breakdown for the custom bouquet layout.
 * 
 * @param {Array} selectedStems - Selected items list
 * @param {Array} stemsDatabase - Database product catalog
 * @param {string} bouquetSize - Current bouquet size key
 * @param {object} activeSizeConfig - Authoritative configuration for selected size
 * @returns {object} Pricing breakdown details
 */
export function getPriceBreakdown(selectedStems = [], stemsDatabase = [], bouquetSize = 'MEDIUM', activeSizeConfig = {}) {
  const hasFlowers = selectedStems.some(item => {
    const dbItem = stemsDatabase.find(s => String(s.id) === String(item.stemId));
    return dbItem && dbItem.category === 'premium-blooms' && (Number(item.quantity) || 0) > 0;
  });

  if (!hasFlowers) {
    return {
      flowerSubtotal: 0,
      bouquetSize,
      sizeLabel: activeSizeConfig?.label || 'Medium',
      sizeMultiplier: isFinite(Number(activeSizeConfig?.priceMultiplier)) && Number(activeSizeConfig?.priceMultiplier) > 0 ? Number(activeSizeConfig?.priceMultiplier) : 1.0,
      sizeAdjustment: 0,
      scaledFlowerTotal: 0,
      serviceCharge: 0,
      grandTotal: 0
    };
  }

  const flowerSubtotal = calculateFlowerSubtotal(selectedStems, stemsDatabase);
  const sizeMultiplier = isFinite(Number(activeSizeConfig?.priceMultiplier)) && Number(activeSizeConfig?.priceMultiplier) > 0 ? Number(activeSizeConfig?.priceMultiplier) : 1.0;
  const scaledFlowerTotal = calculateScaledFlowerTotal(flowerSubtotal, sizeMultiplier);
  const sizeAdjustment = roundCurrency(scaledFlowerTotal - flowerSubtotal);
  const serviceCharge = BASE_SERVICE_CHARGE;
  const grandTotal = calculateGrandTotal(scaledFlowerTotal, serviceCharge);

  return {
    flowerSubtotal,
    bouquetSize,
    sizeLabel: activeSizeConfig?.label || 'Medium',
    sizeMultiplier,
    sizeAdjustment,
    scaledFlowerTotal,
    serviceCharge,
    grandTotal
  };
}
