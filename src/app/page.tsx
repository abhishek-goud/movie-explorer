"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // ✅ Next.js router
import { useAuth } from "@/contexts/AuthContext";
import { Film, Star, Heart, Search } from "lucide-react";
import heroImage from "@/assets/hero-cinema.jpg";
import "./globals.css";

const Index = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/movies"); // ✅ Next.js navigation
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage.src})` }} // ✅ Next.js image import gives .src
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <div className="p-4 rounded-2xl gradient-hero shadow-glow">
              <Film className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-cinema-purple to-cinema-gold bg-clip-text text-transparent">
              MovieMuse
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Discover, explore, and curate your perfect movie collection.
            <br />
            <span className="text-cinema-gold">Your cinematic journey starts here.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => router.push("/auth")}
              className="text-lg px-8 py-4"
            >
              Get Started Free
            </Button>
            <Button 
              variant="cinema" 
              size="lg"
              onClick={() => router.push("/auth")}
              className="text-lg px-8 py-4"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cinema-purple to-cinema-gold bg-clip-text text-transparent">
                Why Choose MovieMuse?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for the perfect movie experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl gradient-card shadow-card">
              <div className="p-4 rounded-xl gradient-hero w-fit mx-auto mb-6">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                Smart Discovery
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Find your next favorite movie with our powerful search and recommendation engine.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl gradient-card shadow-card">
              <div className="p-4 rounded-xl gradient-hero w-fit mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                Personal Collection
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Build and organize your personal movie library with our favorites system.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl gradient-card shadow-card">
              <div className="p-4 rounded-xl gradient-hero w-fit mx-auto mb-6">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                Detailed Insights
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Get comprehensive movie details, ratings, and reviews all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="p-12 rounded-3xl gradient-card shadow-elegant">
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cinema-purple to-cinema-gold bg-clip-text text-transparent">
                Ready to Start Your Journey?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of movie enthusiasts discovering their next favorite film.
            </p>
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => router.push("/auth")}
              className="text-lg px-12 py-4"
            >
              Create Your Account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
