import HeroSlider from "@/components/HeroSlider";
import QuickBooking from "@/components/QuickBooking";
import MovieSection from "@/components/MovieSection"; 
import CinemaCorner from "@/components/CinemaCorner";
import PromotionSection from "@/components/PromotionSection";
import TailwindTest from "@/components/TailwindTest";
import { useNowShowingMovies, useComingSoonMovies } from "@/hooks/useMovies";
import { movieService } from "@/services";

export default async function Home() {

  const nowShowingMovies = await movieService.getNowShowingMovies();
  const comingSoonMovies = await movieService.getComingSoonMovies();
  return (
    <main>
      
      <HeroSlider />
      <div className="container" style={{ position: 'relative', marginTop: '-40px', zIndex: 100 }}>
        <QuickBooking nowShowingMovies={nowShowingMovies} />
      </div>
      <div className="container" style={{ marginTop: '40px' }}>
        <MovieSection nowShowingMovies={nowShowingMovies} comingSoonMovies={comingSoonMovies} />
      </div>
      <CinemaCorner />
      <PromotionSection />
    </main>
  );
}
