import React from 'react';

const Hero = () => {
  return (
    <section
      className="relative h-[850px] bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: 'url(/images/hero_bouquet.png)',
      }}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(250,248,246,0.9) 35%, rgba(250,248,246,0.5) 60%, transparent 100%)' }} />
      <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-28 flex items-center">
        <div className="max-w-2xl text-[#1a1a1a] text-left">
          <h2 className="text-5xl md:text-[80px] leading-[1.08] mb-6 font-bold tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Everlasting
            <br />
            <span className="text-[#8c5e5e] italic font-normal">Elegance</span>
          </h2>
          <p className="text-base md:text-lg text-[#1a1a1a]/85 max-w-lg mb-10 leading-relaxed font-normal font-sans">
            Curated botanical masterpieces that defy time. Experience the hyper-realistic beauty of premium artificial flora for your sophisticated spaces.
          </p>

          <div className="flex flex-row gap-4">
            <button className="px-8 py-3.5 rounded-sm bg-[#7d4d50] hover:bg-[#6b3f42] text-white font-medium transition-all duration-300 text-sm tracking-wide shadow-sm">
              Shop Now
            </button>
            <button className="px-8 py-3.5 rounded-sm border border-[#7d4d50]/70 text-[#1a1a1a] font-medium hover:bg-[#7d4d50]/5 transition-all duration-300 text-sm tracking-wide">
              Customize Bouquet
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
