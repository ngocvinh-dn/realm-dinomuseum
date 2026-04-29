import { useEffect, useState } from 'react';
import { getSiteAssets } from '../services/siteAssetsService';

export function useSiteAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await getSiteAssets();
      if (alive) {
        setAssets(data || []);
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { assets, loading };
}
