import React from 'react';

const Newsletter = () => {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-16 bg-[#eae6e3]">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-3xl md:text-[40px] text-[#1a1a1a] font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          Join the Inner Circle
        </h3>
        <p className="text-[#1a1a1a]/70 text-sm md:text-base mb-10 leading-relaxed font-sans font-normal">
          Be the first to know about our seasonal collections and exclusive design tips for everlasting beauty.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-4">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-5 py-3 rounded-sm border border-[#d9d2d0]/70 bg-white text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/45 focus:outline-none focus:ring-1 focus:ring-[#7d4d50]/40"
          />
          <button className="px-7 py-3 rounded-sm bg-[#7d4d50] hover:bg-[#6b3f42] text-white font-medium text-xs tracking-wider uppercase transition-all duration-300">
            Subscribe Now
          </button>
        </div>
        <p className="text-[10px] md:text-xs text-[#1a1a1a]/50 font-medium font-sans">
          by subscribing, you agree to our Privacy Policy.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
