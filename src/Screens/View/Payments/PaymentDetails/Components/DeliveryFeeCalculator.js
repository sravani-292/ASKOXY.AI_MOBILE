import { supabase } from "../../../../../Config/supabaseClient";

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
  console.log('Calculating delivery fee for:', { userLat, userLng, cartAmount });
  if (!userLat || !userLng) {
    return {
      fee: null,
      distance: 0,
      note: null,
      handlingFee: 0,
      grandTotal: null,
      walletApplicable: false,
      canPlaceOrder: false,
      minOrderForWallet: 0,
      minOrderToPlace: 0,
      addressStatus: false
    };
  }

  // 🏪 Fetch store points
  const storeRes = await supabase
    .from('store_locations')
    .select('*')
    .eq('active', true);

  if (storeRes.error || !storeRes.data.length) {
    return {
      fee: null,
      distance: 0,
      note: 'No active stores found',
      handlingFee: 0,
      grandTotal: null,
      walletApplicable: false,
      canPlaceOrder: false,
      minOrderForWallet: 0,
      minOrderToPlace: 0,
      addressStatus: false
    };
  }

  const storeDistances = storeRes.data.map(store => {
    const distance = getDistanceInKm(store.lat, store.lng, userLat, userLng) * 1.3;
    return { ...store, distance };
  });

  const nearestStore = storeDistances.reduce((a, b) => a.distance < b.distance ? a : b);
  const roundedDistance = parseFloat(nearestStore.distance.toFixed(2));

  // 🔃 Fetch fees and config
  const [deliveryRes, handlingRes, globalRes, walletSlabRes] = await Promise.all([
    supabase.from('delivery_fees').select('*'),
    supabase.from('handling_fees').select('*'),
    supabase.from('global_config').select('*'),
    supabase.from('wallet_eligibility_slabs').select('*').eq('active', true)
  ]);

  if (deliveryRes.error || handlingRes.error || globalRes.error || walletSlabRes.error) {
    return {
      fee: null,
      distance: roundedDistance,
      note: 'Error loading fee config',
      handlingFee: 0,
      grandTotal: null,
      walletApplicable: false,
      canPlaceOrder: false,
      minOrderForWallet: 0,
      minOrderToPlace: 0,
      addressStatus: false
    };
  }

  const deliverySlabs = deliveryRes.data;
  const handlingSlabs = handlingRes.data;
  const walletSlabs = walletSlabRes.data;

  const globalMap = {};
  globalRes.data.forEach(({ key, value }) => globalMap[key] = parseFloat(value));

  const maxDistance = globalMap.max_distance_km ?? 25;
  const minOrderForWallet = globalMap.min_order_for_wallet_use ?? 0;
  

  if (nearestStore.distance > maxDistance) {
    const addressStatus = false;
    return {
      fee: null,
      distance: roundedDistance,
      note: 'Out of service range',
      handlingFee: 0,
      grandTotal: null,
      walletApplicable: false,
      canPlaceOrder: false,
      minOrderForWallet,
      minOrderToPlace: 0,
      addressStatus: addressStatus
    };
  }

  const deliveryFee = getFeeFromSlab(nearestStore.distance, deliverySlabs, ['min_km', 'max_km']);
  const handlingFee = getFeeFromSlab(cartAmount, handlingSlabs, ['min_cart', 'max_cart'], nearestStore.distance);

  const note = `From ${nearestStore.name} → ₹${deliveryFee} delivery + ₹${handlingFee} handling fee`;
  const grandTotal = Math.round(cartAmount + deliveryFee + handlingFee);

  // ✅ Wallet logic (global config)
  const walletApplicable = cartAmount >= minOrderForWallet;

  // ✅ Order placement logic (distance-based slab)
  const placeSlab = walletSlabs.find(slab =>
    (slab.min_km == null || nearestStore.distance >= slab.min_km) &&
    (slab.max_km == null || nearestStore.distance < slab.max_km)
  );
  const minOrderToPlace = placeSlab?.min_order_value ?? 0;
  const canPlaceOrder = cartAmount >= minOrderToPlace;

  return {
    fee: deliveryFee,
    distance: roundedDistance,
    note,
    handlingFee,
    grandTotal,
    walletApplicable,
    canPlaceOrder,
    minOrderForWallet,
    minOrderToPlace,
    nearestStore: {
      id: nearestStore.id,
      name: nearestStore.name,
      lat: nearestStore.lat,
      lng: nearestStore.lng
    },
    addressStatus: true
  };
};
