import React from 'react';
import { Link } from 'react-router-dom';

const CategoryGrid = ({ categories }) => {
  return (
    <section id="shop" className="py-24 px-6 md:px-12 lg:px-16 bg-[#faf8f6]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-row items-end justify-between gap-5">
          <div className="text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8c5e5e] font-semibold mb-3">Collections</p>
            <h3 className="text-3xl md:text-[40px] text-[#1a1a1a] font-bold leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Shop by Variety
            </h3>
          </div>
          {/*<a href="#" className="text-xs uppercase tracking-wider font-semibold text-[#1a1a1a] hover:text-[#8c5e5e] border-b border-[#1a1a1a] pb-0.5 transition-colors duration-300">
            View All Categories
          </a>*/}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, idx) => (
            <Link to={`/category/${category.slug}`} key={idx} className="group relative aspect-[3/4] rounded-sm overflow-hidden shadow-sm cursor-pointer block">
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
