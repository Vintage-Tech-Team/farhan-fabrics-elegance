import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroSummer from "@/assets/hero-summer-collection.jpg";
import heroWinter from "@/assets/hero-winter-collection.jpg";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: heroSummer,
      title: "Summer Lawn Collection 2024",
      subtitle: "Breathable Cotton & Premium Lawn",
      description: "Discover our exquisite summer collection featuring lightweight fabrics perfect for Pakistan's warm climate.",
      season: "summer",
      cta: "Shop Summer Collection"
    },
    {
      id: 2,
      image: heroWinter,
      title: "Winter Khaddar Collection",
      subtitle: "Luxurious Warmth & Traditional Elegance",
      description: "Embrace the winter season with our premium khaddar and wool blend fabrics.",
      season: "winter",
      cta: "Shop Winter Collection"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <div className="animate-fade-in">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${
                    slide.season === 'summer' 
                      ? 'season-badge-summer' 
                      : 'season-badge-winter'
                  }`}>
                    {slide.season === 'summer' ? '☀️ Summer Collection' : '❄️ Winter Collection'}
                  </span>
                  
                  <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h2>
                  
                  <h3 className="text-xl md:text-2xl text-white/90 mb-6 font-medium">
                    {slide.subtitle}
                  </h3>
                  
                  <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
                    {slide.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="btn-hero text-lg px-8 py-6">
                      {slide.cta}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-white/10 text-white border-white/30 hover:bg-white/20 px-8 py-6 text-lg backdrop-blur-sm"
                    >
                      View Lookbook
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 backdrop-blur-sm"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 backdrop-blur-sm"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white" 
                : "bg-white/40 hover:bg-white/60"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;