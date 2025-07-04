import { useEffect, useState } from 'react';
import { supabase } from '../src/Config/supabaseClient';

export const useUIVisibility = () => {
  const [visibilityMap, setVisibilityMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisibilityData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('ui_visibility')
        .select('feature_key, is_visible');

      if (error) {
        console.error('Failed to fetch UI visibility flags:', error.message);
        setVisibilityMap({});
      } else {
        const map = {};
        data.forEach(item => {
          map[item.feature_key] = item.is_visible;
        });
        setVisibilityMap(map);
      }
      setLoading(false);
    };

    fetchVisibilityData();
  }, []);

  return { visibilityMap, loading };
};
