import { useState, useEffect } from 'react';
import { cinemaService } from '@/services';
import { Cinema } from '@/types/api';

export function useCinemas() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cinemaService.getActiveCinemas();
        setCinemas(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch cinemas');
        console.error('Error fetching cinemas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, []);

  return { cinemas, loading, error };
}

export function useCinemasByCity(city: string | undefined) {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!city) {
      setLoading(false);
      return;
    }

    const fetchCinemas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cinemaService.getCinemasByCity(city);
        setCinemas(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch cinemas');
        console.error('Error fetching cinemas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, [city]);

  return { cinemas, loading, error };
}

