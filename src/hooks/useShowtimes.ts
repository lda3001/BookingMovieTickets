import { useState, useEffect } from 'react';
import { showtimeService } from '@/services';
import { Showtime } from '@/types/api';

export function useShowtimesByMovie(movieId: number | undefined) {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) {
      setLoading(false);
      return;
    }

    const fetchShowtimes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await showtimeService.getShowtimesByMovie(movieId);
        setShowtimes(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch showtimes');
        console.error('Error fetching showtimes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movieId]);

  return { showtimes, loading, error };
}

export function useShowtimesByMovieAndCinemaAndDate(
  movieId: number | undefined,
  cinemaId: number | undefined,
  date: string | undefined
) {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId || !cinemaId || !date) {
      setLoading(false);
      return;
    }

    const fetchShowtimes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await showtimeService.getShowtimesByMovieAndCinemaAndDate(
          movieId,
          cinemaId,
          date
        );
        setShowtimes(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch showtimes');
        console.error('Error fetching showtimes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movieId, cinemaId, date]);

  return { showtimes, loading, error };
}

export function useAvailableDates(
  movieId: number | undefined,
  cinemaId: number | undefined
) {
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId || !cinemaId) {
      setLoading(false);
      return;
    }

    const fetchDates = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await showtimeService.getAvailableDates(movieId, cinemaId);
        setDates(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch available dates');
        console.error('Error fetching available dates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, [movieId, cinemaId]);

  return { dates, loading, error };
}

