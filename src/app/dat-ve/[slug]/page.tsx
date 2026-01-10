
import React from 'react';
import { movieService } from '@/services';
import MovieHero from '@/components/booking/MovieHero';
import MovieInfo from '@/components/booking/MovieInfo';
import BookingFilters from '@/components/booking/BookingFilters';
import NowShowingSidebar from '@/components/booking/NowShowingSidebar';
import { notFound } from 'next/navigation';

export default async function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    // Fetch movie data từ API trong Server Component
    let movie;
    try {
        movie = await movieService.getMovieBySlug(slug);
    } catch (error) {
        console.error('Error fetching movie:', error);
        notFound();
    }

    if (!movie) {
        notFound();
    }

    return (
        <main>
            {/* Hero Section with Trailer */}
            <MovieHero movie={movie} />
            
            {/* Main Content */}
            <div style={{ backgroundColor: '#f8f8f8', minHeight: '100vh', padding: '40px 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: 30 }}>
                        {/* Left Column: Movie Info + Filters */}
                        <div>
                            <MovieInfo movie={movie} />
                            <BookingFilters movieId={movie.id} movieTitle={movie.title} />
                        </div>

                        {/* Right Column: Sidebar */}
                        <div>
                            <NowShowingSidebar currentMovieId={movie.id} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
