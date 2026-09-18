import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-[calc(100vh-80px)] min-h-[460px] max-h-[680px] sm:max-h-[720px] overflow-hidden flex items-center">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(to right, rgba(250,248,246,0.92) 35%, rgba(250,248,246,0.6) 65%, transparent 100%)' }} />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-8 md:py-12 flex items-center">
        <div className="max-w-2xl text-[#1a1a1a] text-left">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.08] mb-3 md:mb-5 font-bold tracking-tight"
            style={{ fontFamily: 'Playfair Display, serif', color: '#000000' }}
          >
            Everlasting
            <br />
            <span className="text-[#8c5e5e] italic font-normal">Elegance</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#1a1a1a]/85 max-w-lg mb-6 md:mb-8 leading-relaxed font-normal font-sans">
            Curated botanical masterpieces that defy time. Experience the hyper-realistic beauty of premium artificial flora for your sophisticated spaces.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-stretch sm:items-center">
            <button
              onClick={() => navigate('/shop')}
              className="px-7 py-3.5 rounded-sm bg-[#7d4d50] hover:bg-[#563c37] text-white font-medium transition-all duration-300 text-sm tracking-wide shadow-sm text-center cursor-pointer"
            >
              Shop Now
            </button>
            <button
              onClick={() => navigate('/customization')}
              className="px-7 py-3.5 rounded-sm border border-[#7d4d50]/70 text-[#1a1a1a] font-medium hover:bg-[#563c37] hover:text-white hover:border-[#563c37] transition-all duration-300 text-sm tracking-wide text-center cursor-pointer"
            >
              Customize Bouquet
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
