import { useState } from "react";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Top bar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-serif font-bold gradient-text">
              Farhan Fabrics
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <div className="relative group">
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
                Men
              </a>
            </div>
            <div className="relative group">
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
                Women
              </a>
            </div>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Stitched
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Unstitched
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Summer
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Winter
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </a>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="hidden sm:flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center space-x-2 animate-fade-in">
                  <Input
                    type="search"
                    placeholder="Search fabrics..."
                    className="w-48 transition-all duration-300"
                    autoFocus
                  />
                  <Button variant="ghost" size="sm" onClick={toggleSearch}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={toggleSearch}>
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>
            
            {/* Mobile search */}
            <Button variant="ghost" size="sm" className="sm:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* User account */}
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>

            {/* Shopping bag */}
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                3
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col space-y-3">
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Home
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Men
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Women
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Stitched
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Unstitched
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Summer
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Winter
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                About
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;