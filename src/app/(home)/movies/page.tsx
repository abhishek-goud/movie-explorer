"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { tmdbApi, Movie } from "@/services/tmdbApi";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import MovieGrid from "@/components/MovieGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Movies = () => {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { toggleFavorite, favoriteIds } = useFavorites();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("popular");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  // Popular movies query
  const { data: popularMovies, isLoading: popularLoading } = useQuery({
    queryKey: ["movies", "popular"],
    queryFn: () => tmdbApi.getPopularMovies(),
    enabled: isAuthenticated,
  });

  // Top rated movies query
  const { data: topRatedMovies, isLoading: topRatedLoading } = useQuery({
    queryKey: ["movies", "top_rated"],
    queryFn: () => tmdbApi.getTopRatedMovies(),
    enabled: isAuthenticated,
  });

  // Now playing movies query
  const { data: nowPlayingMovies, isLoading: nowPlayingLoading } = useQuery({
    queryKey: ["movies", "now_playing"],
    queryFn: () => tmdbApi.getNowPlayingMovies(),
    enabled: isAuthenticated,
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await tmdbApi.searchMovies(searchQuery);
      setSearchResults(results.results);
      setActiveTab("search");
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description: "Failed to search movies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    router.push(`/movie/${movie.id}`);
  };

  const handleToggleFavorite = (movie: Movie): void => {
    toggleFavorite(movie);
    toast({
      title: favoriteIds.includes(movie.id) ? "Removed from favorites" : "Added to favorites",
      description: movie.title,
    });
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cinema-purple to-cinema-gold bg-clip-text text-transparent">
                Discover Movies
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Find your next favorite movie from thousands of titles
            </p>
          </div>
          
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="Search for movies..."
          />
        </div>

        {/* Movie Categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="top_rated">Top Rated</TabsTrigger>
            <TabsTrigger value="now_playing">Now Playing</TabsTrigger>
            <TabsTrigger value="search" disabled={searchResults.length === 0}>
              Search Results {searchResults.length > 0 && `(${searchResults.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="popular">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-foreground">Popular Movies</h2>
              <p className="text-muted-foreground">Most popular movies right now</p>
            </div>
            <MovieGrid
              movies={popularMovies?.results || []}
              favorites={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
              onMovieClick={handleMovieClick}
              loading={popularLoading}
            />
          </TabsContent>

          <TabsContent value="top_rated">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-foreground">Top Rated Movies</h2>
              <p className="text-muted-foreground">Highest rated movies of all time</p>
            </div>
            <MovieGrid
              movies={topRatedMovies?.results || []}
              favorites={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
              onMovieClick={handleMovieClick}
              loading={topRatedLoading}
            />
          </TabsContent>

          <TabsContent value="now_playing">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-foreground">Now Playing</h2>
              <p className="text-muted-foreground">Currently in theaters</p>
            </div>
            <MovieGrid
              movies={nowPlayingMovies?.results || []}
              favorites={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
              onMovieClick={handleMovieClick}
              loading={nowPlayingLoading}
            />
          </TabsContent>

          <TabsContent value="search">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Search Results
              </h2>
              <p className="text-muted-foreground">
                Found {searchResults.length} movies for &quot;{searchQuery}&quot;
              </p>
            </div>
            <MovieGrid
              movies={searchResults}
              favorites={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
              onMovieClick={handleMovieClick}
              loading={isSearching}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Movies;
