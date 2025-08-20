/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import MovieGrid from "@/components/MovieGrid";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";

const Favorites = () => {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { favorites, toggleFavorite, favoriteIds, clearFavorites } = useFavorites();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  const handleMovieClick = (movie: any) => {
    router.push(`/movie/${movie.id}`);
  };

  const handleToggleFavorite = (movie: any) => {
    toggleFavorite(movie);
    toast({
      title: "Removed from favorites",
      description: movie.title,
    });
  };

  const handleClearAll = () => {
    if (favorites.length > 0) {
      clearFavorites();
      toast({
        title: "Favorites cleared",
        description: "All movies removed from your favorites",
      });
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/movies")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Movies
            </Button>
          </div>

          {favorites.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="text-destructive hover:text-destructive"
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 rounded-2xl gradient-hero shadow-glow">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cinema-purple to-cinema-gold bg-clip-text text-transparent">
              My Favorites
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            {favorites.length > 0
              ? `Your personal collection of ${favorites.length} favorite ${
                  favorites.length === 1 ? "movie" : "movies"
                }`
              : "Start building your personal movie collection"}
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <MovieGrid
            movies={favorites}
            favorites={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            onMovieClick={handleMovieClick}
            loading={false}
          />
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="p-8 rounded-2xl gradient-card shadow-card mb-6">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  No favorites yet
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Discover amazing movies and add them to your favorites by clicking the heart icon.
                </p>
                <Button
                  variant="hero"
                  onClick={() => router.push("/movies")}
                  className="w-full"
                >
                  Explore Movies
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
