import { supabase } from "../../../Config/supabaseClient";

const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getFeeFromSlab = (value, slabs, valueKeys, distance = null) => {
  const matched = slabs.filter((slab) => {
    const min = slab[valueKeys[0]];
    const max = slab[valueKeys[1]];
    const active = slab.active;

    const distanceMatch =
      distance === null ||
      ((slab.min_km == null || distance >= slab.min_km) &&
       (slab.max_km == null || distance < slab.max_km));

    return (
      active &&
      value >= min &&
      value < max &&
      distanceMatch
    );
  });

  if (matched.length > 0) {
    return matched.reduce((min, curr) => (curr.fee < min.fee ? curr : min)).fee;
  }

  return 0;
};

export const getFinalDeliveryFee = async (userLat, userLng, cartAmount) => {
  if (!userLat || !userLng) {
    return { fee: null, distance: 0, note: null, handlingFee: 0, grandTotal: null };
  }

  // 🏪 Fetch store points
  const storeRes = await supabase
    .from('store_locations')
    .select('*')
    .eq('active', true);

  if (storeRes.error || !storeRes.data.length) {
    console.error('Store fetch error:', storeRes.error);
    return { fee: null, distance: 0, note: 'No active stores found', handlingFee: 0, grandTotal: null };
  }

  const storeDistances = storeRes.data.map(store => {
    const distance = getDistanceInKm(store.lat, store.lng, userLat, userLng) * 1.3;
    return { ...store, distance };
  });

  const nearestStore = storeDistances.reduce((a, b) => a.distance < b.distance ? a : b);
  const roundedDistance = parseFloat(nearestStore.distance.toFixed(2));

  // 🔃 Fetch fees and config
  const [deliveryRes, handlingRes, globalRes] = await Promise.all([
    supabase.from('delivery_fees').select('*'),
    supabase.from('handling_fees').select('*'),
    supabase.from('global_config').select('*')
  ]);

  if (deliveryRes.error || handlingRes.error || globalRes.error) {
    console.error('Fee fetch error:', deliveryRes.error || handlingRes.error || globalRes.error);
    return { fee: null, distance: roundedDistance, note: 'Error loading fee config', handlingFee: 0, grandTotal: null };
  }

  const deliverySlabs = deliveryRes.data;
  const handlingSlabs = handlingRes.data;

  const globalMap = {};
  globalRes.data.forEach(({ key, value }) => globalMap[key] = parseFloat(value));
  const maxDistance = globalMap.max_distance_km ?? 25;

  if (nearestStore.distance > maxDistance) {
    return {
      fee: null,
      distance: roundedDistance,
      note: 'Out of service range',
      handlingFee: 0,
      grandTotal: null
    };
  }

  const deliveryFee = getFeeFromSlab(nearestStore.distance, deliverySlabs, ['min_km', 'max_km']);
  const handlingFee = getFeeFromSlab(cartAmount, handlingSlabs, ['min_cart', 'max_cart'], nearestStore.distance);

  const note = `From ${nearestStore.name} → ₹${deliveryFee} delivery + ₹${handlingFee} handling fee`;
  const grandTotal = Math.round(cartAmount + deliveryFee + handlingFee);

  return {
    fee: deliveryFee,
    distance: roundedDistance,
    note,
    handlingFee,
    grandTotal,
    nearestStore: {
      id: nearestStore.id,
      name: nearestStore.name,
      lat: nearestStore.lat,
      lng: nearestStore.lng
    }
  };
};
