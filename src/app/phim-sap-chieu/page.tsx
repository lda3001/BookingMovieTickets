
import React from 'react';
import { movieService } from '@/services';
import MovieCard from '@/components/MovieCard';
import styles from './page.module.css'; // Reusing similar styles or create new

export const metadata = {
    title: 'Phim Sắp Chiếu | Galaxy Cinema',
    description: 'Danh sách phim sắp chiếu tại Galaxy Cinema.',
};

export default async function UpcomingPage() {
    const movies = await movieService.getComingSoonMovies();

    return (
        <main className="container" style={{ padding: '40px 16px' }}>
            <h1 className={styles.title}>Phim Sắp Chiếu</h1>
            <div className={styles.grid}>
                {movies.map(movie => (
                    <MovieCard
                        key={movie.id}
                        title={movie.title}
                        image={movie.image || ''}
                        rating={movie.rating}
                        duration={movie.duration}
                        slug={movie.slug}
                        ageRating={movie.ageRating}
                    />
                ))}
            </div>
        </main>
    );
}
