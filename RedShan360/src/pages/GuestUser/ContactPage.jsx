import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { MapPin, Phone, Mail, Clock, HelpCircle, ChevronDown, MessageSquare, Compass, Send, CheckCircle, Globe } from 'lucide-react';

const ContactPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Accordion state for FAQs
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Form states
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Home', 'Shop', 'Customization', 'About', 'Contact'];

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Simulate API request submission
    setFormSubmitted(true);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };

  const faqData = [
    {
      question: "How can I place an order?",
      answer: "You can place an order directly through our online Shop by selecting your desired artificial arrangements and adding them to the cart. For bespoke custom orders, you can utilize our 3D Bouquet Customizer tool or consult with one of our designers."
    },
    {
      question: "Can I customize flower arrangements?",
      answer: "Absolutely! RedShan360 specializes in custom designs. You can select specific flowers, colors, fillers, and vases inside our custom 3D studio, or submit an inquiry on this page for special large-scale event requests."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards (Visa, MasterCard, American Express), digital wallets (Apple Pay, Google Pay), and bank transfers for large commercial orders."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard orders are processed and shipped within 3-5 business days. Custom orders and bespoke design consultations require an additional 5-7 business days for handcrafting. International shipping rates and times vary depending on the destination."
    },
    {
      question: "Do you offer wholesale orders?",
      answer: "Yes, we partner with corporate spaces, hotels, retail outlets, and wedding venues globally. Please select 'Wholesale Inquiry' as the subject in the contact form or contact us directly at info@redshan360.com to discuss options."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1a1a1a] flex flex-col font-sans selection:bg-[#e8b4b8]/30 selection:text-[#8c5e5e]">
      {/* Navbar */}
      <Navbar 
        isScrolled={isScrolled} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        navItems={navItems} 
      />

      {/* SECTION 1 - HERO BANNER */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden bg-[#f4f0ed]">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/contact_hero.png" 
            alt="Luxurious artificial flower banner" 
            className="w-full h-full object-cover object-center animate-fade-in"
          />
          {/* Soft dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-playfair mb-4 text-white">
              Contact Us
            </h1>
            <p className="text-sm md:text-lg text-white/95 max-w-2xl mx-auto leading-relaxed font-light">
              We would love to hear from you. Contact our team for inquiries, support, and custom flower arrangements.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 - CONTACT INFORMATION */}
      <section className="py-20 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 -mt-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Address */}
          <div className="bg-white p-8 rounded-sm shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-[#d9d2d0]/20 flex flex-col text-left group">
            <div className="w-10 h-10 rounded-full bg-[#e8b4b8]/15 text-[#8c5e5e] flex items-center justify-center mb-6 group-hover:bg-[#e8b4b8] group-hover:text-white transition-colors duration-300">
              <MapPin size={18} />
            </div>
            <h3 className="font-bold text-sm tracking-wider uppercase text-[#1a1a1a] mb-2">
              Address
            </h3>
            <p className="text-xs md:text-sm text-[#1a1a1a]/70 leading-relaxed font-medium mt-auto">
              Huejay International Multi Flora LTD<br />Sri Lanka
            </p>
          </div>

          {/* Card 2: Phone */}
          <div className="bg-white p-8 rounded-sm shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-[#d9d2d0]/20 flex flex-col text-left group">
            <div className="w-10 h-10 rounded-full bg-[#e8b4b8]/15 text-[#8c5e5e] flex items-center justify-center mb-6 group-hover:bg-[#e8b4b8] group-hover:text-white transition-colors duration-300">
              <Phone size={18} />
            </div>
            <h3 className="font-bold text-sm tracking-wider uppercase text-[#1a1a1a] mb-2">
              Phone
            </h3>
            <p className="text-xs md:text-sm text-[#1a1a1a]/70 leading-relaxed font-medium mt-auto">
              +94 XX XXX XXXX
            </p>
          </div>

          {/* Card 3: Email */}
          <div className="bg-white p-8 rounded-sm shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-[#d9d2d0]/20 flex flex-col text-left group">
            <div className="w-10 h-10 rounded-full bg-[#e8b4b8]/15 text-[#8c5e5e] flex items-center justify-center mb-6 group-hover:bg-[#e8b4b8] group-hover:text-white transition-colors duration-300">
              <Mail size={18} />
            </div>
            <h3 className="font-bold text-sm tracking-wider uppercase text-[#1a1a1a] mb-2">
              Email
            </h3>
            <a 
              href="mailto:info@redshan360.com" 
              className="text-xs md:text-sm text-[#8c5e5e] font-semibold hover:text-[#7d4d50] transition-colors leading-relaxed mt-auto"
            >
              info@redshan360.com
            </a>
          </div>

          {/* Card 4: Business Hours */}
          <div className="bg-white p-8 rounded-sm shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-[#d9d2d0]/20 flex flex-col text-left group">
            <div className="w-10 h-10 rounded-full bg-[#e8b4b8]/15 text-[#8c5e5e] flex items-center justify-center mb-6 group-hover:bg-[#e8b4b8] group-hover:text-white transition-colors duration-300">
              <Clock size={18} />
            </div>
            <h3 className="font-bold text-sm tracking-wider uppercase text-[#1a1a1a] mb-2">
              Business Hours
            </h3>
            <p className="text-xs md:text-sm text-[#1a1a1a]/70 leading-relaxed font-medium mt-auto">
              Monday – Saturday<br />8:00 AM – 6:00 PM
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 - GET IN TOUCH */}
      <section className="py-12 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-5 text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] tracking-tight font-playfair mb-4">
              Get In Touch!
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-[#1a1a1a]/75 mb-10">
              Have questions about our hyper-realistic floral designs or need support with your 3D customization process? Reach out to our design consultants. We are happy to guide you in finding or creating the perfect centerpiece.
            </p>

            <div className="space-y-8">
              {/* Feature 1 */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-sm bg-[#e8b4b8]/10 flex items-center justify-center text-[#8c5e5e] shrink-0">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1a1a1a] uppercase tracking-wider">
                    Premium Support
                  </h4>
                  <p className="text-xs md:text-sm text-[#1a1a1a]/75 mt-1 leading-relaxed">
                    Our dedicated care team is available to assist you with order tracking, design edits, and inquiries.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-sm bg-[#e8b4b8]/10 flex items-center justify-center text-[#8c5e5e] shrink-0">
                  <Compass size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1a1a1a] uppercase tracking-wider">
                    Bespoke Design Consultation
                  </h4>
                  <p className="text-xs md:text-sm text-[#1a1a1a]/75 mt-1 leading-relaxed">
                    Work directly with our floral designers to craft custom silk arrangements matching your space's exact palette.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-sm bg-[#e8b4b8]/10 flex items-center justify-center text-[#8c5e5e] shrink-0">
                  <Globe size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1a1a1a] uppercase tracking-wider">
                    Global Shipping Logistics
                  </h4>
                  <p className="text-xs md:text-sm text-[#1a1a1a]/75 mt-1 leading-relaxed">
                    We coordinate secure, shockproof packaging and tracked global delivery for all premium bouquets.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-7 w-full">
            <div className="bg-white p-8 md:p-10 rounded-sm shadow-soft border border-[#d9d2d0]/20 text-left relative overflow-hidden">
              <h3 className="font-bold text-lg text-[#1a1a1a] tracking-tight uppercase mb-6 font-playfair border-b border-[#d9d2d0]/20 pb-3">
                Send a Message
              </h3>

              {formSubmitted ? (
                <div className="py-10 text-center animate-fade-in">
                  <CheckCircle size={48} className="mx-auto text-[#8c5e5e] mb-4" />
                  <h4 className="font-bold text-lg text-[#1a1a1a] mb-2">Thank you!</h4>
                  <p className="text-sm text-[#1a1a1a]/70">Your message has been successfully sent. We will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-[11px] uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-2">
                        Full Name
                      </label>
                      <input 
                        type="text" 
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full bg-[#fcf9f8] border border-[#d9d2d0] rounded-sm px-4 py-3 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#8c5e5e] focus:bg-white transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-[11px] uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-2">
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-[#fcf9f8] border border-[#d9d2d0] rounded-sm px-4 py-3 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#8c5e5e] focus:bg-white transition-all"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-[11px] uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-2">
                        Phone Number
                      </label>
                      <input 
                        type="tel" 
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-[#fcf9f8] border border-[#d9d2d0] rounded-sm px-4 py-3 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#8c5e5e] focus:bg-white transition-all"
                        placeholder="+94 XX XXX XXXX"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-[11px] uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-2">
                        Subject
                      </label>
                      <input 
                        type="text" 
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full bg-[#fcf9f8] border border-[#d9d2d0] rounded-sm px-4 py-3 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#8c5e5e] focus:bg-white transition-all"
                        placeholder="e.g. Custom Bouquet Design"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[11px] uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-2">
                      Message
                    </label>
                    <textarea 
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full bg-[#fcf9f8] border border-[#d9d2d0] rounded-sm px-4 py-3 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#8c5e5e] focus:bg-white transition-all resize-none"
                      placeholder="Write your message here..."
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#e8b4b8] hover:bg-[#8c5e5e] text-white text-xs font-semibold tracking-widest uppercase py-4 px-6 rounded-sm shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Send Message
                    <Send size={12} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - FREQUENTLY ASKED QUESTIONS */}
      <section className="py-24 bg-white border-t border-b border-[#d9d2d0]/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8c5e5e] font-semibold mb-2 block">
            Common Questions
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] tracking-tight font-playfair mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4 text-left">
            {faqData.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index}
                  className="border border-[#d9d2d0]/30 rounded-sm overflow-hidden bg-[#fcf9f8]/40 hover:bg-[#fcf9f8] transition-colors duration-200"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-[#1a1a1a] hover:text-[#8c5e5e] transition-colors focus:outline-none"
                  >
                    <span className="text-xs md:text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                      <HelpCircle size={14} className="text-[#8c5e5e]/80" />
                      {faq.question}
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={`text-[#1a1a1a]/40 hover:text-[#8c5e5e] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  
                  {/* Collapsible Answer */}
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-40 border-t border-[#d9d2d0]/20' : 'max-h-0'
                    }`}
                  >
                    <p className="p-5 md:p-6 text-xs md:text-sm text-[#1a1a1a]/70 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5 - FOOTER */}
      <Footer />
    </div>
  );
};

export default ContactPage;
