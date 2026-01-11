
import React from 'react';
import { movieService } from '@/services';
import MovieCard from '@/components/MovieCard';
import styles from './page.module.css';

export const metadata = {
    title: 'Phim Đang Chiếu | Galaxy Cinema',
    description: 'Danh sách phim đang chiếu tại Galaxy Cinema.',
};

export default async function NowShowingPage() {
    const movies = await movieService.getNowShowingMovies();

    return (
        <main className="container" style={{ padding: '40px 16px' }}>
            <h1 className={styles.title}>Phim Đang Chiếu</h1>
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
