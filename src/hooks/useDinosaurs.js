import { useEffect, useState } from 'react';
import { getDinosaurs } from '../services/dinosaursService';

export function useDinosaurs() {
  const [dinosaurs, setDinosaurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const data = await getDinosaurs();
        if (alive) setDinosaurs(data || []);
      } catch (err) {
        if (alive) setError(err);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  return { dinosaurs, loading, error };
}
