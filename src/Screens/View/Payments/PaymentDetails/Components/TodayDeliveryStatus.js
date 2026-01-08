import { supabase } from "../../../../../Config/supabaseClient";

export const checkEligibilityForActiveZones = async (userLat, userLng) => {
  try {
    // console.log("Fetching active delivery zones...");

    const { data: zones, error } = await supabase
      .from('delivery_zones')
      .select('id, zonename, centrallat, centrallng, cutofftime, alloweddistance')
      .eq('active', true);

    // console.log("Zones fetched:", zones);

    if (error) {
      console.error("Supabase error:", error);
      return { eligible: false, matchedZone: null, message: 'Error fetching zones.' };
    }

    if (!zones || zones.length === 0) {
      return { eligible: false, matchedZone: null, message: 'No active zones available.' };
    }

    const now = new Date();
    const currentHour = now.getHours();   // 0-23, 24-hour format
    const currentMinute = now.getMinutes();

    for (const zone of zones) {
      const { id, zonename, centrallat, centrallng, cutofftime, alloweddistance } = zone;

      // Parse cutoff time (24-hour format assumed)
      const [cutoffHour, cutoffMinute] = cutofftime.split(':').map(Number);

    //   console.log(`Current time: ${currentHour}:${currentMinute}, Cutoff time: ${cutoffHour}:${cutoffMinute}`);
      

      const isBeforeCutoff =
        currentHour < cutoffHour ||
        (currentHour === cutoffHour && currentMinute <= cutoffMinute);

      // Distance check (Haversine formula)
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371; // Earth's radius in km

      const dLat = toRad(centrallat - userLat);
      const dLng = toRad(centrallng - userLng);

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(userLat)) *
          Math.cos(toRad(centrallat)) *
          Math.sin(dLng / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = parseFloat((R * c).toFixed(2));

    //   console.log(`Zone: ${zonename || id}, Distance: ${distance} KM, CutoffTime: ${cutofftime}`);

      if (isBeforeCutoff && distance <= alloweddistance) {
        return {
          eligible: true,
          matchedZone: {
            id,
            zonename,
            centrallat,
            centrallng,
            cutofftime,
            alloweddistance,
            distance,
          },
          message: `✅ Eligible in ${zonename || 'Unnamed Zone'}: Distance ${distance} KM / Allowed ${alloweddistance} KM, Time within cutoff ${cutofftime}`,
        };
      }
    }

    return {
      eligible: false,
      matchedZone: null,
      message: '❌ Not eligible in any active delivery zone (either time expired or distance too far)',
    };

  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      eligible: false,
      matchedZone: null,
      message: 'Unexpected error occurred.',
      error: err.message,
    };
  }
};
