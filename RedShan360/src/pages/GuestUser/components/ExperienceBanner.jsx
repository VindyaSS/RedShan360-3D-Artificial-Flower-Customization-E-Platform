import { useNavigate } from 'react-router-dom';
import { ZoomIn, RotateCw, Sun } from 'lucide-react';

const ExperienceBanner = () => {
  const navigate = useNavigate();
  return (
    <section id="customization" className="scroll-mt-[80px] py-10 sm:py-12 lg:py-14 px-6 md:px-12 lg:px-16 bg-[#f4f0ed]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
          {/* Left Column: Interactive Image Visualizer */}
          <div className="relative aspect-[4/3] md:aspect-[1.3] max-h-[380px] lg:max-h-[400px] rounded-sm overflow-hidden shadow-md group">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            >
              <source src="/videos/360video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/15 transition-colors duration-300 pointer-events-none" />

            {/* Bottom Left Badge */}
            <div className="absolute left-4 bottom-4 bg-white border border-[#1a1a1a]/5 rounded-full px-3.5 py-1.5 inline-flex items-center gap-2 shadow-sm pointer-events-none z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8c5e5e] animate-pulse" />
              <span className="text-[9px] uppercase tracking-[0.16em] font-bold text-[#1a1a1a]/90">Interactive 360° View</span>
            </div>
          </div>

          {/* Right Column: Experience Details */}
          <div className="text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8c5e5e] font-semibold mb-2">Experience</p>
            <h3 className="text-3xl sm:text-4xl text-[#1a1a1a] font-bold leading-tight mb-3 md:mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Beauty From Every Angle
            </h3>
            <p className="text-[#1a1a1a]/80 text-sm md:text-base leading-relaxed mb-5 md:mb-6 font-sans font-normal">
              Our proprietary RedShan360 visualization tool allows you to inspect every petal, leaf, and stem in stunning 4K detail. Never wonder how your arrangement looks from the back again.
            </p>

            <div className="space-y-3 md:space-y-3.5">
              <div className="flex items-center gap-3.5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#8c5e5e] shadow-sm">
                  <ZoomIn size={16} />
                </div>
                <p className="text-sm text-[#1a1a1a]/90 font-medium">Precision Zoom up to magnification</p>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#8c5e5e] shadow-sm">
                  <RotateCw size={16} />
                </div>
                <p className="text-sm text-[#1a1a1a]/90 font-medium">Fluid 360-degree rotation control</p>
              </div>

            </div>

            <button
              onClick={() => navigate('/customization')}
              className="mt-6 md:mt-7 px-8 py-3.5 rounded-sm bg-[#555555] hover:bg-[#444444] text-white font-medium text-sm tracking-wide transition-all duration-300 shadow-sm cursor-pointer"
            >
              Try the Visualizer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceBanner;
