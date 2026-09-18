import { useState, useMemo } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import roseCrownHeadDress from '../../../assets/images/head-dresses/rose-crown-head-dress.png';
import pearlBlossomFloralCrown from '../../../assets/images/head-dresses/pearl-blossom-floral-crown.png';

const FeaturedProducts = ({ products, wishlist, toggleWishlist }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Combine products with Head Dress items
  const featuredList = useMemo(() => {
    const baseItems = Array.isArray(products) && products.length > 0
      ? products.filter(p => p.type !== 'head-dress').slice(0, 3)
      : [];

    // Find headdress items from products prop if available
    let headDresses = Array.isArray(products)
      ? products.filter(p =>
          p.type === 'head-dress' ||
          (p.title && (p.title.toLowerCase().includes('head') || p.title.toLowerCase().includes('crown') || p.title.toLowerCase().includes('tiara')))
        )
      : [];

    // Guarantee 2 head dress products (e.g. Lily Blossom Head Dress & Pearl Blossom Floral Crown)
    const defaultHeadDresses = [
      {
        id: 14,
        title: 'Lily Blossom Head Dress',
        categoryName: 'Head Dresses',
        category: 'silk',
        type: 'head-dress',
        subtitle: 'Bridal Royalty Series',
        price: 'Rs 5500.00',
        numericPrice: 5500,
        rating: 4.9,
        stockQuantity: 25,
        image: roseCrownHeadDress,
      },
      {
        id: 15,
        title: 'Pearl Blossom Floral Crown',
        categoryName: 'Head Dresses',
        category: 'silk',
        type: 'head-dress',
        subtitle: 'Bridal Majesty Series',
        price: 'Rs 6200.00',
        numericPrice: 6200,
        rating: 4.8,
        stockQuantity: 18,
        image: pearlBlossomFloralCrown,
      }
    ];

    if (headDresses.length < 2) {
      headDresses = [...headDresses, ...defaultHeadDresses].slice(0, 2);
    } else {
      headDresses = headDresses.slice(0, 2);
    }

    // Merge base items with head dress items avoiding duplicates by ID
    const combined = [...baseItems];
    headDresses.forEach(hd => {
      if (!combined.some(item => item.id === hd.id)) {
        combined.push(hd);
      }
    });

    return combined;
  }, [products]);

  const itemsPerPage = 3;
  const maxIndex = Math.max(0, featuredList.length - itemsPerPage);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const visibleProducts = featuredList.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className="scroll-mt-[80px] py-10 sm:py-12 lg:py-14 px-6 md:px-12 lg:px-16 bg-[#faf8f6]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8c5e5e] font-semibold mb-1">Curated Selection</p>
            <h3 className="text-3xl sm:text-4xl text-[#1a1a1a] font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
              Featured Arrangements
            </h3>
          </div>

          {/* Carousel < > Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-[#d9d2d0] bg-white hover:bg-[#8c5e5e] hover:border-[#8c5e5e] hover:text-white text-[#1a1a1a] flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer active:scale-95"
              aria-label="Previous Featured Arrangements"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-[#d9d2d0] bg-white hover:bg-[#8c5e5e] hover:border-[#8c5e5e] hover:text-white text-[#1a1a1a] flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer active:scale-95"
              aria-label="Next Featured Arrangements"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full transition-all duration-300">
          {visibleProducts.map((product) => (
            <article key={product.id} className="group bg-transparent text-left relative flex flex-col justify-between h-full w-full animate-fade-in">
              <div className="flex flex-col flex-grow">
                {/* Product Image Container */}
                <div className="relative aspect-[3/4] max-h-[360px] lg:max-h-[380px] rounded-sm overflow-hidden bg-[#f4f0ed] shadow-sm mb-3 border border-[#d9d2d0]/15 w-full">
                  <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </Link>

                  {/* Bestseller/Discount/HeadDress Badge */}
                  {product.discountPercentage > 0 ? (
                    <div className="absolute top-3 left-3 bg-[#e88d9d] text-white px-2.5 py-1 rounded-sm text-[9px] font-bold tracking-widest uppercase shadow-sm">
                      {product.discountPercentage}% OFF
                    </div>
                  ) : product.type === 'head-dress' ? (
                    <div className="absolute top-3 left-3 bg-[#8c5e5e] text-white px-2.5 py-1 rounded-sm text-[9px] font-bold tracking-widest uppercase shadow-sm">
                      HEAD DRESS
                    </div>
                  ) : product.id === 2 ? (
                    <div className="absolute top-3 left-3 bg-[#f5e6e8] text-[#8c5e5e] px-2.5 py-1 rounded-sm text-[9px] font-bold tracking-widest shadow-sm">
                      BESTSELLER
                    </div>
                  ) : null}

                  {/* Wishlist Heart Icon */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (toggleWishlist) toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 bg-white hover:scale-105 transition-transform duration-300 w-8 h-8 rounded-full flex items-center justify-center shadow-sm z-10 cursor-pointer"
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      size={15}
                      className={`transition-all duration-300 ${wishlist && wishlist[product.id] ? 'fill-[#8c5e5e] text-[#8c5e5e]' : 'text-gray-400'
                        }`}
                    />
                  </button>

                  {/* Quick Add Overlay on Hover */}
                  <Link
                    to={`/product/${product.id}`}
                    className="absolute left-3 right-3 bottom-3 py-2 rounded-sm bg-white/95 text-[#1a1a1a] font-medium text-xs tracking-wider uppercase opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#7d4d50] hover:text-white transition-all duration-300 shadow-md text-center z-10 block"
                  >
                    View Details
                  </Link>
                </div>

                {/* Product Info */}
                <div className="pt-1 px-1 flex-grow flex flex-col justify-start">
                  <span className="text-[10px] font-bold text-[#8c5e5e]/85 uppercase tracking-wider block mb-0.5">
                    {product.categoryName || product.category || 'Head Dresses'}
                  </span>
                  <Link to={`/product/${product.id}`} className="hover:text-[#8c5e5e] transition-colors">
                    <h4 className="text-base sm:text-lg text-[#1a1a1a] font-bold group-hover:text-[#8c5e5e] transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {product.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-[#1a1a1a]/60 mt-0.5 font-sans">
                    {product.subtitle}
                  </p>
                </div>
              </div>

              <div className="px-1 pt-2 flex justify-between items-center border-t border-[#d9d2d0]/20 mt-2.5">
                <p className="text-sm text-[#1a1a1a] font-bold font-sans">
                  {product.price}
                </p>
                <span className="text-[10px] font-bold text-[#1a1a1a]/55 tracking-wide">
                  {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
