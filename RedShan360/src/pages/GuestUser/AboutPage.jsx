import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ArrowRight, Droplet, Beaker, Zap, Flower, PenTool, Globe, Award, Sparkles, Heart } from 'lucide-react';

const AboutPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Solid navbar on scroll or always show solid if desired.
    // Let's use the scroll effect similar to the home page.
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Home', 'Shop', 'Customization', 'About', 'Contact'];

  const scrollToHeritage = () => {
    const element = document.getElementById('heritage');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1a1a1a] flex flex-col font-sans selection:bg-[#8c5e5e]/20 selection:text-[#8c5e5e]">
      {/* Navbar */}
      <Navbar 
        isScrolled={isScrolled} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        navItems={navItems} 
      />

      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-[90vh] flex items-center justify-start overflow-hidden bg-luxury-beige">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center animate-fade-in"
          >
            <source src="/videos/video2.mp4" type="video/mp4" />
          </video>
          {/* Subtle soft gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f6]/70 via-[#faf8f6]/40 to-transparent md:from-[#faf8f6]/85" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 text-left">
          <div className="max-w-2xl animate-slide-up">
            <span className="text-xs md:text-sm font-bold tracking-[0.25em] text-[#8c5e5e] uppercase">
              Established 1983
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1a1a1a] font-playfair mt-3 leading-none">
              About Us
            </h1>
            <p className="text-lg md:text-2xl italic text-[#1a1a1a]/70 font-playfair font-medium mt-4 leading-relaxed">
              Crafting Beauty Through Artificial Floral Excellence
            </p>
            <button 
              onClick={scrollToHeritage}
              className="mt-8 bg-[#8c5e5e] hover:bg-[#7d4d50] text-white text-xs font-semibold tracking-[0.2em] uppercase py-4 px-8 rounded-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
            >
              Discover Our Heritage 
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Our Story / How We Began (Our Legacy of Craft) */}
      <section id="heritage" className="py-24 bg-white border-b border-[#d9d2d0]/20 scroll-mt-[80px]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column - Image */}
            <div className="md:col-span-5 lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-xl border border-[#d9d2d0]/30 bg-luxury-beige">
                <img 
                  src="/images/about_craft.png" 
                  alt="Artisan hand-crafting rose" 
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
              </div>
            </div>

            {/* Right Column - Text & Stats */}
            <div className="md:col-span-7 lg:col-span-7 text-left flex flex-col justify-center">
              <span className="text-xs uppercase tracking-[0.2em] text-[#8c5e5e] font-semibold mb-2 block">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] tracking-tight font-playfair mb-6">
                Our Legacy of Craft
              </h2>
              
              <div className="space-y-6 text-sm md:text-base leading-relaxed text-[#1a1a1a]/75">
                <p className="font-semibold text-[#1a1a1a] text-[15px] md:text-[17px] leading-relaxed border-l-2 border-[#8c5e5e] pl-4">
                  Huajay International Multi Flora LTD was founded in 1983 by the visionary Madam Jayanthy. 
                  What began as a passionate endeavor to replicate the transient beauty of nature has evolved into a global benchmark for artificial floral artistry.
                </p>
                <p>
                  For four decades, RedShan360 has curated collections that grace the world's most prestigious interiors, 
                  merging traditional artisanal techniques with modern design sensibilities to create blooms that never fade.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 border-t border-[#d9d2d0]/30 pt-10 mt-10">
                <div>
                  <span className="block text-3xl md:text-4xl font-bold font-playfair text-[#8c5e5e]">
                    40+
                  </span>
                  <span className="block text-[9px] md:text-[10px] font-bold tracking-[0.15em] text-[#1a1a1a]/50 uppercase mt-1">
                    Years Experience
                  </span>
                </div>
                <div>
                  <span className="block text-3xl md:text-4xl font-bold font-playfair text-[#8c5e5e]">
                    300k
                  </span>
                  <span className="block text-[9px] md:text-[10px] font-bold tracking-[0.15em] text-[#1a1a1a]/50 uppercase mt-1">
                    Global Exports
                  </span>
                </div>
                <div>
                  <span className="block text-3xl md:text-4xl font-bold font-playfair text-[#8c5e5e]">
                    150+
                  </span>
                  <span className="block text-[9px] md:text-[10px] font-bold tracking-[0.15em] text-[#1a1a1a]/50 uppercase mt-1">
                    Custom Designs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Empowering Individuals & Communities */}
      <section className="py-24 bg-[#faf8f6] border-b border-[#d9d2d0]/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <div className="lg:col-span-5 text-left">
              <span className="text-xs uppercase tracking-[0.2em] text-[#8c5e5e] font-semibold mb-2 block">
                Social Impact
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] tracking-tight font-playfair mb-8">
                Empowering Individuals & Communities
              </h2>

              <div className="space-y-8">
                {/* Feature 1 */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-sm bg-[#8c5e5e]/10 flex items-center justify-center shrink-0">
                    <Sparkles size={18} className="text-[#8c5e5e]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1a1a1a] uppercase tracking-wider">
                      Women-Led Workforce
                    </h3>
                    <p className="text-xs md:text-sm text-[#1a1a1a]/70 mt-1 leading-relaxed">
                      80% of our 400 dedicated employees are women, providing economic independence and professional growth opportunities within their local communities.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-sm bg-[#8c5e5e]/10 flex items-center justify-center shrink-0">
                    <Heart size={18} className="text-[#8c5e5e]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1a1a1a] uppercase tracking-wider">
                      Purpose Over Profit
                    </h3>
                    <p className="text-xs md:text-sm text-[#1a1a1a]/70 mt-1 leading-relaxed">
                      100% of our profits are reinvested back into community development, sustainable infrastructure, and employee welfare programs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Two Image Grid */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-lg border border-[#d9d2d0]/25 bg-luxury-beige">
                  <img 
                    src="/images/about_artisan.png" 
                    alt="Artisan working on flower" 
                    className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-lg border border-[#d9d2d0]/25 bg-luxury-beige mt-6 lg:mt-12">
                  <img 
                    src="/images/about_bouquet.png" 
                    alt="Finished flower arrangement" 
                    className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700 ease-out"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Practices */}
      <section className="py-24 bg-white border-b border-[#d9d2d0]/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8c5e5e] font-semibold mb-2 block">
            Environmental Responsibility
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] tracking-tight font-playfair mb-3">
            Sustainable Practices
          </h2>
          <p className="text-[#1a1a1a]/60 italic text-sm md:text-base font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
            "Our commitment to beauty goes beyond aesthetics; we ensure our footprint is as delicate as our petals."
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-left">
            {/* Card 1 */}
            <div className="p-8 rounded-sm bg-[#faf8f6] border border-[#d9d2d0]/20 hover:shadow-soft transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#8c5e5e]">
                <Droplet size={18} />
              </div>
              <h3 className="font-bold text-sm text-[#1a1a1a] uppercase tracking-wider mt-6 mb-3">
                Water Conservation
              </h3>
              <p className="text-xs md:text-sm text-[#1a1a1a]/70 leading-relaxed">
                Advanced recycling systems in our production facilities reduce water consumption by 60% compared to traditional industry standards.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-sm bg-[#faf8f6] border border-[#d9d2d0]/20 hover:shadow-soft transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#8c5e5e]">
                <Beaker size={18} />
              </div>
              <h3 className="font-bold text-sm text-[#1a1a1a] uppercase tracking-wider mt-6 mb-3">
                Minimal Chemicals
              </h3>
              <p className="text-xs md:text-sm text-[#1a1a1a]/70 leading-relaxed">
                We utilize eco-friendly dyes and toxin-free polymers to ensure our flowers are safe for your home and the environment.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-sm bg-[#faf8f6] border border-[#d9d2d0]/20 hover:shadow-soft transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#8c5e5e]">
                <Zap size={18} />
              </div>
              <h3 className="font-bold text-sm text-[#1a1a1a] uppercase tracking-wider mt-6 mb-3">
                Energy Reduction
              </h3>
              <p className="text-xs md:text-sm text-[#1a1a1a]/70 leading-relaxed">
                Our manufacturing lines are partially powered by solar energy, aiming for a carbon-neutral production cycle by 2030.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-[#faf8f6] border-b border-[#d9d2d0]/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8c5e5e] font-semibold mb-2 block">
            Our Quality Promise
          </span>
          <div className="relative inline-block pb-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] tracking-tight font-playfair">
              Why Choose Us
            </h2>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-[2px] bg-[#8c5e5e]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Card 1 */}
            <div className="p-7 rounded-sm bg-white border border-[#d9d2d0]/25 shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-[#8c5e5e] mb-4">
                <Flower size={20} />
              </div>
              <h3 className="font-bold text-[14px] uppercase tracking-wider text-[#1a1a1a] mb-2.5">
                Premium Flowers
              </h3>
              <p className="text-xs text-[#1a1a1a]/70 leading-relaxed">
                Hyper-realistic botanical accuracy using the finest Japanese and European silk blends.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-7 rounded-sm bg-white border border-[#d9d2d0]/25 shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-[#8c5e5e] mb-4">
                <PenTool size={20} />
              </div>
              <h3 className="font-bold text-[14px] uppercase tracking-wider text-[#1a1a1a] mb-2.5">
                Custom Designs
              </h3>
              <p className="text-xs text-[#1a1a1a]/70 leading-relaxed">
                Bespoke arrangements tailored to match your specific interior palette and architectural vision.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-7 rounded-sm bg-white border border-[#d9d2d0]/25 shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-[#8c5e5e] mb-4">
                <Globe size={20} />
              </div>
              <h3 className="font-bold text-[14px] uppercase tracking-wider text-[#1a1a1a] mb-2.5">
                Sustainable Practices
              </h3>
              <p className="text-xs text-[#1a1a1a]/70 leading-relaxed">
                Ethically sourced materials and environmentally conscious production for a cleaner future.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-7 rounded-sm bg-white border border-[#d9d2d0]/25 shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-[#8c5e5e] mb-4">
                <Award size={20} />
              </div>
              <h3 className="font-bold text-[14px] uppercase tracking-wider text-[#1a1a1a] mb-2.5">
                Trusted Quality
              </h3>
              <p className="text-xs text-[#1a1a1a]/70 leading-relaxed">
                Decades of supply-chain excellence and rigorous quality control for lasting durability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section (Ready to Elevate Your Space?) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="relative rounded-sm overflow-hidden bg-[#503535] text-white py-16 px-8 md:px-16 text-center shadow-xl border border-black/5">
            {/* Subtle organic floral watermark decoration inside */}
            <div className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none" style={{ backgroundImage: "url('/images/cat_roses.png')", filter: "grayscale(100%)" }} />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-playfair tracking-tight mb-4 text-white">
                Ready to Elevate Your Space?
              </h2>
              <p className="text-xs md:text-sm text-white/80 font-medium leading-relaxed mb-8 max-w-lg mx-auto">
                Discover how our bespoke artificial floral designs can transform your environment into a sanctuary of everlasting beauty.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <a 
                  href="/shop"
                  className="w-full sm:w-auto text-center border border-white hover:bg-white hover:text-[#503535] text-white text-xs uppercase tracking-[0.2em] font-semibold py-3.5 px-8 rounded-sm transition-all duration-300"
                >
                  Explore Collection
                </a>
                <a 
                  href="#contact"
                  className="w-full sm:w-auto text-center border border-white hover:bg-white hover:text-[#503535] text-white text-xs uppercase tracking-[0.2em] font-semibold py-3.5 px-8 rounded-sm transition-all duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Consult a Designer
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join The Inner Circle / Newsletter */}
      <section className="py-16 bg-[#faf8f6] border-t border-[#d9d2d0]/20">
        <div className="max-w-md mx-auto px-6 text-center">
          <span className="text-[10px] tracking-[0.25em] font-bold text-[#1a1a1a]/50 uppercase mb-3 block">
            Join the Inner Circle
          </span>
          <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="w-full bg-white border border-[#d9d2d0] rounded-sm px-4 py-3 text-xs text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:border-[#8c5e5e] focus:ring-1 focus:ring-[#8c5e5e]/25 transition-all"
              required
            />
            <button 
              type="button"
              className="w-full sm:w-auto bg-[#e8b4b8] hover:bg-[#8c5e5e] text-white font-semibold text-xs tracking-widest uppercase py-3 px-6 rounded-sm whitespace-nowrap transition-colors duration-300"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutPage;
