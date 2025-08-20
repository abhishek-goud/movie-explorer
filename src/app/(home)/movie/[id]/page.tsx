/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // ✅ Next.js hooks
import { useQuery } from "@tanstack/react-query";
import { tmdbApi } from "@/services/tmdbApi";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Heart, Star, Calendar, Clock } from "lucide-react";
import Image from "next/image";

const MovieDetail = () => {
  const params = useParams(); // ✅ replaces react-router useParams
  const router = useRouter(); // ✅ replaces react-router useNavigate
  const { isAuthenticated, logout } = useAuth();
  const { toggleFavorite, favoriteIds } = useFavorites();
  const { toast } = useToast();

  const movieId = parseInt((params?.id as string) || "0");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  const {
    data: movie,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => tmdbApi.getMovieDetails(movieId),
    enabled: isAuthenticated && movieId > 0,
  });

  const handleToggleFavorite = () => {
    if (movie) {
      toggleFavorite(movie);
      toast({
        title: favoriteIds.includes(movie.id)
          ? "Removed from favorites"
          : "Added to favorites",
        description: movie.title,
      });
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Movie not found
            </h1>
            <p className="text-muted-foreground mb-6">
              The movie you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button variant="hero" onClick={() => router.push("/movies")}>
              Back to Movies
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="aspect-[2/3] w-full rounded-xl" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const posterUrl = movie.poster_path
    ? tmdbApi.getImageUrl(movie.poster_path, "w500")
    : "/placeholder.svg";

  const backdropUrl = movie.backdrop_path
    ? tmdbApi.getImageUrl(movie.backdrop_path, "w1280")
    : null;

  const isFavorite = favoriteIds.includes(movie.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />

      {/* Backdrop */}
      {backdropUrl && (
        <div className="relative h-96 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          />
          <div className="absolute inset-0 gradient-overlay" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/movies")}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Movies
        </Button>

        {/* Movie Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Image
                height={90}
                width={90}
                src={posterUrl}
                alt={movie.title}
                className="w-full rounded-xl shadow-card"
              />

              <Button
                variant={isFavorite ? "destructive" : "hero"}
                onClick={handleToggleFavorite}
                className="w-full mt-4"
                size="lg"
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`}
                />
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
            </div>
          </div>

          {/* Movie Info */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-xl text-cinema-gold italic mb-4">
                    &quot;{movie.tagline}&quot;
                  </p>
                )}
              </div>

              {/* Rating and Info */}
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-cinema-gold text-cinema-gold" />
                  {movie.vote_average.toFixed(1)} / 10
                </Badge>

                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(movie.release_date).getFullYear()}
                </Badge>

                {movie.runtime && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </Badge>
                )}
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre: any) => (
                    <Badge key={genre.id} variant="secondary">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Overview */}
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Overview
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {movie.overview}
                </p>
              </div>

              {/* Additional Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Details
                  </h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      <strong>Status:</strong> {movie.status}
                    </p>
                    <p>
                      <strong>Original Language:</strong>{" "}
                      {movie.original_language.toUpperCase()}
                    </p>
                    {movie.budget > 0 && (
                      <p>
                        <strong>Budget:</strong> $
                        {movie.budget.toLocaleString()}
                      </p>
                    )}
                    {movie.revenue > 0 && (
                      <p>
                        <strong>Revenue:</strong> $
                        {movie.revenue.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {movie.production_companies &&
                  movie.production_companies.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Production
                      </h3>
                      <div className="space-y-1 text-muted-foreground">
                        {movie.production_companies
                          .slice(0, 3)
                          .map((company: any) => (
                            <p key={company.id}>{company.name}</p>
                          ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
