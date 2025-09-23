import { Card } from "@/components/ui/card";
import menFormal from "@/assets/men-formal-navy.jpg";
import womenFormal from "@/assets/women-formal-emerald.jpg"; 
import fabricCollection from "@/assets/fabric-collection.jpg";
import stitchedMens from "@/assets/stitched-menswear.jpg";
import unstitchedFabric from "@/assets/unstitched-womens-fabric.jpg";

const FeaturedCategories = () => {
  const categories = [
    {
      id: 1,
      title: "Men's Collection",
      subtitle: "Traditional & Modern Styles",
      image: menFormal,
      description: "From formal shalwar kameez to casual kurtas",
      link: "/shop/men"
    },
    {
      id: 2,
      title: "Women's Collection", 
      subtitle: "Elegant & Contemporary",
      image: womenFormal,
      description: "Lawn, silk, and premium fabric ensembles",
      link: "/shop/women"
    },
    {
      id: 3,
      title: "Premium Fabrics",
      subtitle: "Quality Materials",
      image: fabricCollection,
      description: "Cotton, Lawn, Khaddar, Silk & More",
      link: "/shop/fabrics"
    }
  ];

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Explore Collections
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our carefully curated collections of premium Pakistani fabrics and clothing for every season and occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card key={category.id} className="category-card">
              <div className="relative h-80 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-serif font-semibold mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-white/90 mb-1">
                    {category.subtitle}
                  </p>
                  <p className="text-sm text-white/80">
                    {category.description}
                  </p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium text-lg bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                    Shop Now
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stitched vs Unstitched Categories */}
        <div className="mt-16">
          <h3 className="text-2xl font-serif font-bold text-center mb-8">
            Shop by Style
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <Card className="category-card">
              <div className="relative h-80 overflow-hidden">
                <img
                  src={stitchedMens}
                  alt="Stitched Collection"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h4 className="text-2xl font-serif font-semibold mb-2">
                    Stitched Collection
                  </h4>
                  <p className="text-sm text-white/90 mb-2">
                    Ready-to-Wear Clothing
                  </p>
                  <p className="text-sm text-white/80">
                    Perfect fit, premium tailoring, immediate delivery
                  </p>
                </div>

                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium text-lg bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                    Shop Stitched
                  </span>
                </div>
              </div>
            </Card>

            <Card className="category-card">
              <div className="relative h-80 overflow-hidden">
                <img
                  src={unstitchedFabric}
                  alt="Unstitched Collection"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h4 className="text-2xl font-serif font-semibold mb-2">
                    Unstitched Fabric
                  </h4>
                  <p className="text-sm text-white/90 mb-2">
                    Premium Fabric Pieces
                  </p>
                  <p className="text-sm text-white/80">
                    Custom tailoring, perfect measurements, your style
                  </p>
                </div>

                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium text-lg bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                    Shop Unstitched
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Seasonal Categories */}
        <div className="mt-16">
          <h3 className="text-2xl font-serif font-bold text-center mb-8">
            Shop by Season
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="category-card">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-orange-200" />
                <div className="relative p-8 h-full flex flex-col justify-center items-center text-center">
                  <span className="text-4xl mb-4">☀️</span>
                  <h4 className="text-2xl font-serif font-bold text-orange-800 mb-2">
                    Summer Collection
                  </h4>
                  <p className="text-orange-700 mb-4">
                    Lightweight Cotton, Lawn & Breathable Fabrics
                  </p>
                  <span className="season-badge-summer">
                    Perfect for Hot Weather
                  </span>
                </div>
              </div>
            </Card>

            <Card className="category-card">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-blue-200" />
                <div className="relative p-8 h-full flex flex-col justify-center items-center text-center">
                  <span className="text-4xl mb-4">❄️</span>
                  <h4 className="text-2xl font-serif font-bold text-slate-800 mb-2">
                    Winter Collection
                  </h4>
                  <p className="text-slate-700 mb-4">
                    Warm Khaddar, Wool & Cozy Fabrics
                  </p>
                  <span className="season-badge-winter">
                    Luxurious Warmth
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;