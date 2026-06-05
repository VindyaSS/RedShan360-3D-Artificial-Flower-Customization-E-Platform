import React from 'react';
import { Heart } from 'lucide-react';

const FeaturedProducts = ({ products, wishlist, toggleWishlist }) => {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-16 bg-[#faf8f6]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[#8c5e5e] font-semibold mb-3">Curated Selection</p>
          <h3 className="text-3xl md:text-[40px] text-[#1a1a1a] font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
            Featured Arrangements
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <article key={product.id} className="group bg-transparent text-left">
              {/* Product Image Container */}
              <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-[#f4f0ed] shadow-sm">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                
                {/* Bestseller Badge */}
                {product.badge && (
                  <div className="absolute top-3 left-3 bg-[#f5e6e8] text-[#8c5e5e] px-2.5 py-1 rounded-sm text-[9px] font-bold tracking-widest">
                    {product.badge}
                  </div>
                )}
                
                {/* Wishlist Heart Icon */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 bg-white hover:scale-105 transition-transform duration-300 w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    size={15}
                    className={`transition-all duration-300 ${
                      wishlist[product.id] ? 'fill-[#8c5e5e] text-[#8c5e5e]' : 'text-gray-400'
                    }`}
                  />
                </button>

                {/* Quick Add Overlay on Hover */}
                <button className="absolute left-3 right-3 bottom-3 px-4 py-2.5 rounded-sm bg-white/95 text-[#1a1a1a] font-medium text-xs tracking-wider uppercase opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#7d4d50] hover:text-white transition-all duration-300 shadow-md">
                  Quick Add
                </button>
              </div>

              {/* Product Info */}
              <div className="pt-4 px-1">
                <h4 className="text-lg text-[#1a1a1a] font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {product.title}
                </h4>
                <p className="text-xs text-[#1a1a1a]/60 mt-1 font-sans">
                  {product.description}
                </p>
                <p className="text-sm text-[#1a1a1a] font-bold mt-2 font-sans">
                  {product.price}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
