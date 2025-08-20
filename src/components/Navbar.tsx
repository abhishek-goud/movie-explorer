"use client";

import { Film, Heart, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter, usePathname } from "next/navigation";

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar = ({ isAuthenticated, onLogout }: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 glassmorphism border-b border-border/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => router.push("/")}
          >
            <div className="p-2 rounded-lg gradient-hero">
              <Film className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cinema-purple to-cinema-gold bg-clip-text text-transparent">
              MovieMuse
            </span>
          </div>

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              <Button
                variant={pathname === "/movies" ? "cinema" : "ghost"}
                onClick={() => router.push("/movies")}
              >
                Browse Movies
              </Button>
              <Button
                variant={pathname === "/favorites" ? "cinema" : "ghost"}
                onClick={() => router.push("/favorites")}
              >
                <Heart className="h-4 w-4 mr-2" />
                My Favorites
              </Button>
            </div>
          )}

          {/* Auth Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={() => router.push("/auth")}>
                  Login
                </Button>
                <Button variant="hero" onClick={() => router.push("/auth")}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
