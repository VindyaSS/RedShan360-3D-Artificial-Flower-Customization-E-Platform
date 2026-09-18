import React from 'react';
import { Link } from 'react-router-dom';

const CategoryGrid = ({ categories }) => {
  return (
    <section id="shop" className="scroll-mt-[80px] py-10 sm:py-12 lg:py-14 px-6 md:px-12 lg:px-16 bg-[#faf8f6]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[#8c5e5e] font-semibold mb-2">Collections</p>
          <h3 className="text-3xl sm:text-4xl text-[#1a1a1a] font-bold leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Shop by Variety
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
          {categories.map((category, idx) => (
            <Link
              to={`/category/${category.slug}`}
              key={idx}
              className="group relative aspect-[3/4] max-h-[380px] lg:max-h-[400px] rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer block w-full mx-auto"
            >
              <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-colors duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                <h4 className="text-xl md:text-2xl text-white font-medium" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {category.name}
                </h4>
                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-white/95 font-medium mt-1">{category.tag}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
