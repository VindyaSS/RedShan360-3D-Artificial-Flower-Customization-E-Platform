import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import api from '../../services/api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import contactHeroBg from '../../assets/images/contact_hero.jpg';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Facebook,
  Instagram,
  MessageCircle,
  Loader2
} from 'lucide-react';
import { SiGooglemaps } from 'react-icons/si';

// EmailJS Constants
const SERVICE_ID = "service_47etspc";
const TEMPLATE_ID = "template_44dzenn";
const PUBLIC_KEY = "gz6MEcZFQaUA0ZVN8";

const ContactPage = () => {
  const formRef = useRef();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  // Validation errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Sending status
  const [isSending, setIsSending] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '' }

  useEffect(() => {
    // Initialize EmailJS v4 globally
    emailjs.init({
      publicKey: PUBLIC_KEY,
    });

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Home', 'Shop', 'Customization', 'About', 'Contact'];

  // Email format regex
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Real-time validator
  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          errorMsg = 'Full Name is required.';
        }
        break;
      case 'email':
        if (!value.trim()) {
          errorMsg = 'Email Address is required.';
        } else if (!validateEmail(value)) {
          errorMsg = 'Please enter a valid email address.';
        }
        break;
      case 'subject':
        if (!value.trim()) {
          errorMsg = 'Subject is required.';
        }
        break;
      case 'message':
        if (!value.trim()) {
          errorMsg = 'Message is required.';
        } else if (value.trim().length < 10) {
          errorMsg = 'Message must be at least 10 characters long.';
        }
        break;
      default:
        break;
    }
    return errorMsg;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Run validation on change if touched
    if (touched[name]) {
      const errorMsg = validateField(name, value);
      setErrors((prev) => ({ ...prev, name: errorMsg }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {};
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

    setTouched(allTouched);
    setErrors(newErrors);

    // If there are errors, stop
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSending(true);
    setNotification(null);

    try {
      // Call backend API to persist notification for admins
      try {
        await api.post('/api/contact', formData);
      } catch (backendErr) {
        console.warn('Backend contact notification sync failed:', backendErr);
      }

      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        PUBLIC_KEY
      );

      // Success
      setNotification({
        type: 'success',
        message: 'Thank you! Your message has been sent successfully. We will get back to you as soon as possible.'
      });

      // Clear fields
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setTouched({});
      setErrors({});
    } catch (error) {
      console.error('EmailJS error details:', error.text || error.message || error);
      // Failed
      setNotification({
        type: 'error',
        message: `Sorry! Something went wrong. ${error.text || 'Please try again later.'}`
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1a1a1a] flex flex-col font-sans selection:bg-[#e8b4b8]/30 selection:text-[#8c5e5e] animate-fade-in-page">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-page {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-slide-up-card {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Navbar */}
      <Navbar
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        navItems={navItems}
      />

      {/* Top Hero Section with Floral Background */}
      <section className="relative min-h-[420px] md:min-h-[480px] pt-36 pb-16 flex items-center justify-start overflow-hidden border-b border-[#d9d2d0]/30">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={contactHeroBg}
            alt="Redshan Flora Contact Background"
            className="w-full h-full object-cover object-[80%_center] md:object-right transition-opacity duration-700"
          />
          {/* Subtle soft gradient overlay for text readability on left side */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fcf9f8]/95 via-[#fcf9f8]/85 to-transparent md:from-[#fcf9f8]/95 md:via-[#fcf9f8]/75 md:to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 text-left">
          <div className="max-w-xl animate-slide-up-card">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C2185B] font-bold mb-3 block">
              Get in touch
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Contact Us
            </h1>
            <p className="text-sm md:text-base text-[#1a1a1a]/80 leading-relaxed font-normal">
              Have questions about our hyper-realistic floral designs or need support? Reach out to our design consultants.
            </p>
          </div>
        </div>
      </section>

      {/* Toast Notification Popups */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-slide-up-card">
          <div className={`p-4 rounded-md shadow-lg flex items-start gap-3 border ${notification.type === 'success'
            ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]'
            : 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]'
            }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="shrink-0 mt-0.5" size={18} />
            ) : (
              <AlertCircle className="shrink-0 mt-0.5" size={18} />
            )}
            <div className="flex-1">
              <p className="text-xs font-semibold leading-normal">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs font-bold uppercase tracking-wider hover:opacity-75 transition-opacity"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content Form & Info split */}
      <main className="flex-1 py-16 max-w-7xl w-full mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* LEFT SIDE: Send Message Form */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-xl shadow-sm border border-[#d9d2d0]/20 text-left transition-all duration-300">
            <h3 className="font-bold text-xl text-[#1a1a1a] tracking-tight uppercase mb-6 font-playfair border-b border-[#d9d2d0]/20 pb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Send a Message
            </h3>

            <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-6">

              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-[11px] uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-2">
                    Full Name <span className="text-[#C2185B]">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full bg-[#fcf9f8] border rounded-md px-4 py-3 text-xs text-[#1a1a1a] focus:outline-none transition-all ${errors.fullName && touched.fullName
                      ? 'border-[#C62828] focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828]'
                      : 'border-[#d9d2d0] focus:border-[#C2185B] focus:ring-1 focus:ring-[#C2185B] focus:bg-white'
                      }`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && touched.fullName && (
                    <p className="text-[10px] text-[#C62828] mt-1.5 font-medium flex items-center gap-1">
                      <AlertCircle size={10} /> {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-[11px] uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-2">
                    Email Address <span className="text-[#C2185B]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full bg-[#fcf9f8] border rounded-md px-4 py-3 text-xs text-[#1a1a1a] focus:outline-none transition-all ${errors.email && touched.email
                      ? 'border-[#C62828] focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828]'
                      : 'border-[#d9d2d0] focus:border-[#C2185B] focus:ring-1 focus:ring-[#C2185B] focus:bg-white'
                      }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && touched.email && (
                    <p className="text-[10px] text-[#C62828] mt-1.5 font-medium flex items-center gap-1">
                      <AlertCircle size={10} /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Phone and Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    className="w-full bg-[#fcf9f8] border border-[#d9d2d0] rounded-md px-4 py-3 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#C2185B] focus:ring-1 focus:ring-[#C2185B] focus:bg-white transition-all"
                    placeholder="+94 XX XXX XXXX"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-[11px] uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-2">
                    Subject <span className="text-[#C2185B]">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full bg-[#fcf9f8] border rounded-md px-4 py-3 text-xs text-[#1a1a1a] focus:outline-none transition-all ${errors.subject && touched.subject
                      ? 'border-[#C62828] focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828]'
                      : 'border-[#d9d2d0] focus:border-[#C2185B] focus:ring-1 focus:ring-[#C2185B] focus:bg-white'
                      }`}
                    placeholder="e.g. Custom Bouquet Design"
                  />
                  {errors.subject && touched.subject && (
                    <p className="text-[10px] text-[#C62828] mt-1.5 font-medium flex items-center gap-1">
                      <AlertCircle size={10} /> {errors.subject}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-[11px] uppercase tracking-wider font-bold text-[#1a1a1a]/60 mb-2">
                  Message <span className="text-[#C2185B]">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  rows="6"
                  className={`w-full bg-[#fcf9f8] border rounded-md px-4 py-3 text-xs text-[#1a1a1a] focus:outline-none transition-all resize-none ${errors.message && touched.message
                    ? 'border-[#C62828] focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828]'
                    : 'border-[#d9d2d0] focus:border-[#C2185B] focus:ring-1 focus:ring-[#C2185B] focus:bg-white'
                    }`}
                  placeholder="Write your message here..."
                ></textarea>
                {errors.message && touched.message && (
                  <p className="text-[10px] text-[#C62828] mt-1.5 font-medium flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-[#C2185B] hover:bg-[#a0134a] disabled:bg-[#C2185B]/60 text-white text-xs font-semibold tracking-widest uppercase py-4 px-6 rounded-md shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isSending ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={12} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT SIDE: Contact Information */}
          <div className="lg:col-span-5 space-y-6 w-full text-left">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#d9d2d0]/20 space-y-6">

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Redshan Flora
                </h2>
                <p className="text-xs uppercase tracking-[0.15em] text-[#C2185B] font-semibold mt-1">Premium Botanical Artistry</p>
              </div>

              <div className="border-t border-[#d9d2d0]/30 pt-6 space-y-5">

                {/* Address */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#C2185B]/10 text-[#C2185B] flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1a1a1a]/60 uppercase tracking-wider">Address</h4>
                    <p className="text-xs md:text-sm text-[#1a1a1a]/85 leading-relaxed font-semibold mt-1">
                      Redshan Flora,
                      32B, Sir Mohamed Macan Marker Mawatha,
                      Colombo<br />Sri Lanka
                    </p>
                    <button
                      onClick={() => window.open("https://maps.app.goo.gl/422Yf2rPWjKNsLtr7", "_blank", "noopener,noreferrer")}
                      className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold text-xs md:text-sm px-4 py-2.5 rounded-[10px] shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                      title="Click to navigate using Google Maps"
                    >
                      <SiGooglemaps size={16} />
                      <span>Open in Google Maps</span>
                    </button>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#C2185B]/10 text-[#C2185B] flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1a1a1a]/60 uppercase tracking-wider">Phone Number</h4>
                    <p className="text-xs md:text-sm text-[#1a1a1a]/85 leading-relaxed font-semibold mt-1">
                      +94 11 234 5678
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#C2185B]/10 text-[#C2185B] flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1a1a1a]/60 uppercase tracking-wider">Email Address</h4>
                    <a
                      href="mailto:info@redshan360.com"
                      className="text-xs md:text-sm text-[#C2185B] font-bold hover:underline leading-relaxed mt-1 block"
                    >
                      redshanflora@gmail.com
                    </a>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#C2185B]/10 text-[#C2185B] flex items-center justify-center shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1a1a1a]/60 uppercase tracking-wider">Working Hours</h4>
                    <p className="text-xs md:text-sm text-[#1a1a1a]/85 leading-relaxed font-semibold mt-1">
                      Monday – Saturday: 8:00 AM – 6:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>

              </div>

              {/* Social Media Icons */}
              <div className="border-t border-[#d9d2d0]/30 pt-6">
                <h4 className="font-bold text-xs text-[#1a1a1a]/60 uppercase tracking-wider mb-4">Follow Us</h4>
                <div className="flex items-center gap-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-[#f4f0ed] hover:bg-[#C2185B] text-[#1a1a1a]/70 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-[#f4f0ed] hover:bg-[#C2185B] text-[#1a1a1a]/70 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    href="https://wa.me/94112345678"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-[#f4f0ed] hover:bg-[#C2185B] text-[#1a1a1a]/70 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle size={18} />
                  </a>
                </div>
              </div>

            </div>

            {/* Google Maps Embed Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#d9d2d0]/20 overflow-hidden h-72">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.9757659424754!2d79.8488!3d6.9271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2593f4e24eb2d%3A0xe21287c71e2efd22!2sHuejay%20International%20Multi%20Flora%20LTD!5e0!3m2!1sen!2slk!4v1719700000000!5m2!1sen!2slk"
                className="w-full h-full border-0 rounded-md"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Huejay International Location Map"
              ></iframe>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactPage;
