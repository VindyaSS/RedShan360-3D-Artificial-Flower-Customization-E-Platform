import { ZoomIn, RotateCw, Sun } from 'lucide-react';

const ExperienceBanner = () => {
  return (
    <section id="customization" className="py-24 px-6 md:px-12 lg:px-16 bg-[#f4f0ed]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Interactive Image Visualizer */}
          <div className="relative aspect-[4/3] md:aspect-[1.4] rounded-sm overflow-hidden shadow-md group">
            <img
              src="/images/visualizer_360.png"
              alt="RedShan360 interactive visualizer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/15 transition-colors duration-300" />
            
            {/* Center 360 Rotation Overlay Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/50 text-white flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                </svg>
              </button>
            </div>
            
            {/* Bottom Left Badge */}
            <div className="absolute left-4 bottom-4 bg-white border border-[#1a1a1a]/5 rounded-full px-3.5 py-1.5 inline-flex items-center gap-2 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8c5e5e] animate-pulse" />
              <span className="text-[9px] uppercase tracking-[0.16em] font-bold text-[#1a1a1a]/90">Interactive 360° View</span>
            </div>
          </div>

          {/* Right Column: Experience Details */}
          <div className="text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8c5e5e] font-semibold mb-3">Experience</p>
            <h3 className="text-3xl md:text-[40px] text-[#1a1a1a] font-bold leading-tight mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
              Beauty From Every Angle
            </h3>
            <p className="text-[#1a1a1a]/80 text-sm md:text-base leading-relaxed mb-8 font-sans font-normal">
              Our proprietary RedShan360 visualization tool allows you to inspect every petal, leaf, and stem in stunning 4K detail. Never wonder how your arrangement looks from the back again.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#8c5e5e] shadow-sm">
                  <ZoomIn size={16} />
                </div>
                <p className="text-sm text-[#1a1a1a]/90 font-medium">Precision Zoom up to 10x magnification</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#8c5e5e] shadow-sm">
                  <RotateCw size={16} />
                </div>
                <p className="text-sm text-[#1a1a1a]/90 font-medium">Fluid 360-degree rotation control</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#8c5e5e] shadow-sm">
                  <Sun size={16} />
                </div>
                <p className="text-sm text-[#1a1a1a]/90 font-medium">Simulated daylight and evening lighting modes</p>
              </div>
            </div>

            <button className="mt-10 px-8 py-3.5 rounded-sm bg-[#555555] hover:bg-[#444444] text-white font-medium text-sm tracking-wide transition-all duration-300">
              Try the Visualizer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceBanner;
