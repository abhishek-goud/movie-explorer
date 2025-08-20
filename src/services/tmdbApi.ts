/* eslint-disable @typescript-eslint/no-explicit-any */
const API_KEY = "fe4a973091aa8e16299d12aa95208919"; // Replace with your TMDB API key
const BASE_URL = "https://api.themoviedb.org/3";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
  vote_count: number;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  production_companies: { id: number; name: string; logo_path: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { iso_639_1: string; name: string }[];
}

export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

class TMDBApi {
  private apiKey: string;

  constructor() {
    this.apiKey = API_KEY;
  }

  private async fetchFromAPI(endpoint: string): Promise<any> {
    const url = `${BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("TMDB API Error:", error);
      throw error;
    }
  }

  async getPopularMovies(page: number = 1): Promise<TMDBResponse> {
    return this.fetchFromAPI(`/movie/popular?page=${page}`);
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetchFromAPI(`/search/movie?query=${encodedQuery}&page=${page}`);
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.fetchFromAPI(`/movie/${movieId}`);
  }

  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse> {
    return this.fetchFromAPI(`/movie/top_rated?page=${page}`);
  }

  async getNowPlayingMovies(page: number = 1): Promise<TMDBResponse> {
    return this.fetchFromAPI(`/movie/now_playing?page=${page}`);
  }

  async getUpcomingMovies(page: number = 1): Promise<TMDBResponse> {
    return this.fetchFromAPI(`/movie/upcoming?page=${page}`);
  }

  getImageUrl(path: string, size: string = "w500"): string {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.svg";
  }
}

export const tmdbApi = new TMDBApi();