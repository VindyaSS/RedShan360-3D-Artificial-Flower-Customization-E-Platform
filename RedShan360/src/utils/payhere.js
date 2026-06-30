import api from '../services/api';

/**
 * Triggers the PayHere modal checkout flow.
 *
 * @param {Object} options - Checkout settings.
 * @param {string} options.merchantId - Merchant ID returned from backend.
 * @param {string} options.orderId - Unique order identifier returned from backend.
 * @param {number|string} options.amount - Verified payment amount returned from backend.
 * @param {string} options.currency - Currency code (default: 'LKR').
 * @param {string} options.hash - Secure MD5 signature hash generated on the backend.
 * @param {string} options.itemsName - Name or description of the checkout items.
 * @param {Object} options.callbacks - Callbacks for checkout events.
 * @param {Function} options.callbacks.onCompleted - Payment success callback.
 * @param {Function} options.callbacks.onDismissed - Payment dismissed callback.
 * @param {Function} options.callbacks.onError - Payment error callback.
 */
export const triggerPayHereCheckout = ({ merchantId, orderId, amount, currency = "LKR", hash, itemsName, callbacks }) => {
  if (!window.payhere) {
    const errorMsg = "PayHere SDK is not loaded. Please ensure the index.html script tag is correct.";
    console.error(errorMsg);
    if (callbacks?.onError) {
      callbacks.onError(errorMsg);
    } else {
      alert(errorMsg);
    }
    return;
  }

  const amountFormatted = parseFloat(amount).toFixed(2);
  const backendBaseUrl = api.defaults.baseURL || "http://localhost:8080";
  const notifyUrl = `${backendBaseUrl}/api/checkout/notify`;

  const paymentDetails = {
    sandbox: true, // Set to true for Sandbox environment
    merchant_id: merchantId,
    return_url: window.location.origin + "/payment-success",
    cancel_url: window.location.origin + "/payment-cancel",
    notify_url: notifyUrl,
    order_id: orderId,
    items: itemsName,
    amount: amountFormatted,
    currency: currency,
    hash: hash,
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "0771234567",
    address: "123 Flower Road",
    city: "Colombo",
    country: "Sri Lanka"
  };

  // Define global SDK event handlers
  window.payhere.onCompleted = (completedOrderId) => {
    console.log("Payment completed. OrderID:", completedOrderId);
    if (callbacks?.onCompleted) {
      callbacks.onCompleted(completedOrderId);
    }
  };

  window.payhere.onDismissed = () => {
    console.log("Payment dismissed by user");
    if (callbacks?.onDismissed) {
      callbacks.onDismissed();
    }
  };

  window.payhere.onError = (error) => {
    console.error("Payment error:", error);
    if (callbacks?.onError) {
      callbacks.onError(error);
    }
  };

  // Start checkout modal
  window.payhere.startPayment(paymentDetails);
};
