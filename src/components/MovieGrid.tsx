import { Skeleton } from "./ui/skeleton";
import MovieCard from "./MovieCard";
import { Movie } from "@/services/tmdbApi";

// interface Movie {
//   id: number;
//   title: string;
//   poster_path: string;
//   vote_average: number;
//   release_date: string;
//   overview: string;
// }

interface MovieGridProps {
  movies: Movie[];
  favorites: number[];
  onToggleFavorite: (movie: Movie) => void;
  onMovieClick: (movie: Movie) => void;
  loading?: boolean;
}

const MovieGrid = ({ movies, favorites, onToggleFavorite, onMovieClick, loading }: MovieGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="aspect-[2/3] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-muted-foreground text-lg mb-4">No movies found</div>
        <p className="text-muted-foreground">Try adjusting your search terms</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={favorites.includes(movie.id)}
          onToggleFavorite={onToggleFavorite}
          onClick={onMovieClick}
        />
      ))}
    </div>
  );
};

export default MovieGrid;