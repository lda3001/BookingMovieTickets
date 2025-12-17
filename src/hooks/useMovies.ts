import { useState, useEffect } from 'react';
import { movieService } from '@/services';
import { Movie } from '@/types/api';

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await movieService.getAllMovies();
        setMovies(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch movies');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return { movies, loading, error };
}

export function useNowShowingMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await movieService.getNowShowingMovies();
        setMovies(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch now showing movies');
        console.error('Error fetching now showing movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return { movies, loading, error };
}

export function useComingSoonMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await movieService.getComingSoonMovies();
        setMovies(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch coming soon movies');
        console.error('Error fetching coming soon movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return { movies, loading, error };
}

export function useMovie(slug: string) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await movieService.getMovieBySlug(slug);
        setMovie(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch movie');
        console.error('Error fetching movie:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchMovie();
    }
  }, [slug]);

  return { movie, loading, error };
}

