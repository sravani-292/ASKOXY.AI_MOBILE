const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Delivery Fee: ₹5 for first 5km, then ₹2/km
 * Max fee: ₹30, Max distance: 25km
 * @param {number} userLat
 * @param {number} userLng
 * @returns {number|null} fee or null if not serviceable
 */
const calculateDeliveryFee = (userLat, userLng) => {
  const storeLat = 17.485833;
  const storeLng = 78.424194;

  let distance = getDistanceInKm(storeLat, storeLng, userLat, userLng);

  // 🔁 Adjust with road buffer (30%)
  distance = distance * 1.3;

  if (distance > 25) return null; // Out of service range
  if (distance <= 5) return 5;

  const extraDistance = distance - 5;
  const additionalFee = Math.ceil(extraDistance) * 2;

  return Math.min(5 + additionalFee, 30); // Max ₹30
};

export default calculateDeliveryFee;
