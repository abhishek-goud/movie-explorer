import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Movie } from "@/services/tmdbApi";

interface FavoritesContextType {
  favorites: Movie[];
  favoriteIds: number[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (movieId: number) => void;
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (movieId: number) => boolean;
  clearFavorites: () => void;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    // Load favorites from localStorage on mount
    const storedFavorites = localStorage.getItem("movieapp_favorites");
    if (storedFavorites) {
      try {
        const parsedFavorites: Movie[] = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
        setFavoriteIds(parsedFavorites.map(movie => movie.id));
      } catch (error) {
        console.error("Error parsing stored favorites:", error);
        localStorage.removeItem("movieapp_favorites");
      }
    }
  }, []);

  const saveFavoritesToStorage = (newFavorites: Movie[]) => {
    localStorage.setItem("movieapp_favorites", JSON.stringify(newFavorites));
  };

  const addFavorite = (movie: Movie) => {
    if (!favoriteIds.includes(movie.id)) {
      const newFavorites = [...favorites, movie];
      setFavorites(newFavorites);
      setFavoriteIds([...favoriteIds, movie.id]);
      saveFavoritesToStorage(newFavorites);
    }
  };

  const removeFavorite = (movieId: number) => {
    const newFavorites = favorites.filter(movie => movie.id !== movieId);
    setFavorites(newFavorites);
    setFavoriteIds(favoriteIds.filter(id => id !== movieId));
    saveFavoritesToStorage(newFavorites);
  };

  const toggleFavorite = (movie: Movie) => {
    if (favoriteIds.includes(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  const isFavorite = (movieId: number): boolean => {
    return favoriteIds.includes(movieId);
  };

  const clearFavorites = () => {
    setFavorites([]);
    setFavoriteIds([]);
    localStorage.removeItem("movieapp_favorites");
  };

  const value: FavoritesContextType = {
    favorites,
    favoriteIds,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};