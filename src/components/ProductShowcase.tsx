import { useState } from "react";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import menNavy from "@/assets/men-formal-navy.jpg";
import womenEmerald from "@/assets/women-formal-emerald.jpg";
import womenPink from "@/assets/women-casual-pink.jpg";
import menWinter from "@/assets/men-winter-brown.jpg";

const ProductShowcase = () => {
  const [activeTab, setActiveTab] = useState("bestsellers");

  const products = {
    bestsellers: [
      {
        id: 1,
        name: "Premium Navy Shalwar Kameez",
        price: 4500,
        originalPrice: 5000,
        image: menNavy,
        fabric: "Cotton",
        season: "summer",
        rating: 4.8,
        reviews: 124,
        category: "men",
        type: "stitched",
        sale: true
      },
      {
        id: 2,
        name: "Emerald Lawn Dupatta Set",
        price: 3200,
        originalPrice: null,
        image: womenEmerald,
        fabric: "Lawn",
        season: "summer",
        rating: 4.9,
        reviews: 89,
        category: "women",
        type: "unstitched",
        sale: false
      },
      {
        id: 3,
        name: "Pink Floral Summer Kurti",
        price: 2800,
        originalPrice: 3200,
        image: womenPink,
        fabric: "Cotton",
        season: "summer",
        rating: 4.7,
        reviews: 156,
        category: "women",
        type: "stitched",
        sale: true
      },
      {
        id: 4,
        name: "Brown Khaddar Kurta",
        price: 3800,
        originalPrice: null,
        image: menWinter,
        fabric: "Khaddar",
        season: "winter",
        rating: 4.6,
        reviews: 73,
        category: "men",
        type: "unstitched",
        sale: false
      }
    ],
    newArrivals: [
      {
        id: 5,
        name: "Emerald Lawn Dupatta Set",
        price: 3200,
        originalPrice: null,
        image: womenEmerald,
        fabric: "Lawn", 
        season: "summer",
        rating: 4.9,
        reviews: 89,
        category: "women",
        type: "stitched",
        sale: false
      },
      {
        id: 6,
        name: "Brown Khaddar Kurta",
        price: 3800,
        originalPrice: null,
        image: menWinter,
        fabric: "Khaddar",
        season: "winter",
        rating: 4.6,
        reviews: 73,
        category: "men",
        type: "stitched",
        sale: false
      }
    ]
  };

  const tabs = [
    { id: "bestsellers", label: "Best Sellers", count: products.bestsellers.length },
    { id: "newArrivals", label: "New Arrivals", count: products.newArrivals.length }
  ];

  const currentProducts = products[activeTab as keyof typeof products];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our most popular and newest additions to the Farhan Fabrics collection.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-muted rounded-lg p-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`px-6 py-3 rounded-md transition-all duration-300 ${
                  activeTab === tab.id 
                    ? "bg-background shadow-card" 
                    : "hover:bg-background/50"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                <Badge variant="secondary" className="ml-2">
                  {tab.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <Card key={product.id} className="product-card group">
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Sale Badge */}
                {product.sale && (
                  <Badge className="absolute top-3 left-3 bg-maroon text-maroon-foreground">
                    Sale
                  </Badge>
                )}

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" variant="secondary" className="w-8 h-8 p-0 rounded-full shadow-card">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="w-8 h-8 p-0 rounded-full shadow-card">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {/* Add to Cart - appears on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button className="w-full btn-hero py-2 text-sm">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              <div className="p-4">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="fabric-badge">
                    {product.fabric}
                  </span>
                  <span className={product.season === 'summer' ? 'season-badge-summer' : 'season-badge-winter'}>
                    {product.season === 'summer' ? '☀️ Summer' : '❄️ Winter'}
                  </span>
                  <span className={`fabric-badge ${product.type === 'stitched' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-maroon/10 text-maroon border-maroon/20'}`}>
                    {product.type === 'stitched' ? '✂️ Stitched' : '📏 Unstitched'}
                  </span>
                </div>

                {/* Product Name */}
                <h3 className="font-semibold text-lg mb-2 text-card-foreground line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? 'fill-current' : 'fill-current opacity-30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="price-display">
                    PKR {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="price-original">
                      PKR {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button className="btn-hero px-8 py-4 text-lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;