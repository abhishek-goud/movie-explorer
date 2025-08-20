import { Heart, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Movie } from "@/services/tmdbApi";
import Image from "next/image";

// interface Movie {
//   id: number;
//   title: string;
//   poster_path: string;
//   vote_average: number;
//   release_date: string;
//   overview: string;
// }

interface MovieCardProps {
  movie: Movie;
  isFavorite?: boolean;
  onToggleFavorite?: (movie: Movie) => void;
  onClick?: (movie: Movie) => void;
}

const MovieCard = ({ movie, isFavorite, onToggleFavorite, onClick }: MovieCardProps) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.svg";

  return (
    <div className="movie-card group cursor-pointer" onClick={() => onClick?.(movie)}>
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-smooth group-hover:scale-110"
          fill
        />
        <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-smooth" />
        
        {/* Favorite button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-smooth glassmorphism"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(movie);
          }}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-cinema-red text-cinema-red' : 'text-white'}`} />
        </Button>

        {/* Rating badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 glassmorphism"
        >
          <Star className="h-3 w-3 fill-cinema-gold text-cinema-gold mr-1" />
          {movie.vote_average.toFixed(1)}
        </Badge>

        {/* Hover overlay with info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-smooth">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
            {movie.title}
          </h3>
          <p className="text-white/80 text-sm line-clamp-3 mb-3">
            {movie.overview}
          </p>
          <Button variant="hero" size="sm" className="w-full">
            View Details
          </Button>
        </div>
      </div>

      {/* Basic info always visible */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
          {movie.title}
        </h3>
        <p className="text-muted-foreground text-sm">
          {new Date(movie.release_date).getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;