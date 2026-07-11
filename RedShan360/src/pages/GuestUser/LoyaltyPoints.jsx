import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import api from '../../services/api';
import { 
  Star, 
  Award, 
  Gift, 
  Coins,
  Check, 
  ArrowRight,
  Sparkles,
  HelpCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const LoyaltyPoints = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // State for live API data (conforming to requested state naming)
  const [loyalty, setLoyalty] = useState({
    points: 0,
    membership: 'Bronze',
    nextLevel: 'Silver',
    pointsToNext: 100
  });

  const [checkoutData, setCheckoutData] = useState({
    points: 0,
    membership: 'Bronze',
    membershipDiscount: 0,
    redeemablePoints: 0,
    redeemDiscount: 0,
    remainingPoints: 0
  });

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Retrieve user ID from localStorage
  const savedUser = localStorage.getItem('user');
  let user = null;
  if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {
      console.error('Failed to parse user in LoyaltyPoints:', e);
    }
  }
  const userId = user ? (user.id || user.userId) : null;

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Home', 'Shop', 'Customization', 'About', 'Contact'];

  // Fetch points from live database endpoints with cache-busting timestamp params
  const fetchLoyaltyData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const [loyaltyRes, checkoutRes] = await Promise.all([
        api.get(`/api/loyalty/${userId}?t=${Date.now()}`),
        api.get(`/api/loyalty/redeem/${userId}?t=${Date.now()}`)
      ]);
      setLoyalty(loyaltyRes.data);
      setCheckoutData(checkoutRes.data);
    } catch (err) {
      console.error("Error fetching loyalty details:", err);
      setToast({ type: 'error', message: 'Failed to retrieve live loyalty point details. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch data on mount, route transitions, tab focus activation, and 2s interval short polling
  useEffect(() => {
    fetchLoyaltyData();

    const handleFocus = () => {
      fetchLoyaltyData();
    };

    const interval = setInterval(() => {
      fetchLoyaltyData();
    }, 2000);

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [userId, location.key]);

  // Execute points redemption mapping
  const handleRedeemPoints = async () => {
    if (!userId) return;
    const redeemablePoints = checkoutData.redeemablePoints || 0;
    
    if (redeemablePoints <= 0) {
      setToast({ type: 'error', message: 'You need at least 100 points to perform a redemption.' });
      return;
    }

    try {
      setIsRedeeming(true);
      setToast(null);
      
      const response = await api.post('/api/loyalty/redeem', {
        userId: userId,
        points: redeemablePoints
      });

      // Update balance
      setLoyalty(response.data);
      
      // Show success toast
      setToast({ type: 'success', message: 'Loyalty points redeemed successfully.' });
      
      // Dispatch update event to refresh navbar badges
      window.dispatchEvent(new Event('wishlist-updated')); // triggers generic navbar count update
      
      // Re-fetch remaining data
      await fetchLoyaltyData();
    } catch (err) {
      console.error("Error redeeming points:", err);
      const errMsg = err.response?.data?.message || 'Error occurred while executing point redemption.';
      setToast({ type: 'error', message: errMsg });
    } finally {
      setIsRedeeming(false);
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Membership Levels benefits dictionary
  const tierBenefits = [
    { name: 'Bronze', discount: '0%', range: '0 - 99 Points', desc: 'Standard entry level status' },
    { name: 'Silver', discount: '5%', range: '100 - 299 Points', desc: 'Priority order processing and seasonal discounts' },
    { name: 'Gold', discount: '10%', range: '300 - 499 Points', desc: 'Free packaging upgrades and dedicated support' },
    { name: 'Platinum', discount: '15%', range: '500+ Points', desc: 'Complimentary shipping and express custom styling' }
  ];

  // Point status tier calculation variables
  const getProgressPercent = () => {
    const pts = loyalty.points || 0;
    if (pts >= 500) return 100;
    if (pts >= 300) return ((pts - 300) / 200) * 100;
    if (pts >= 100) return ((pts - 100) / 200) * 100;
    return (pts / 100) * 100;
  };

  const getTierColorClass = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'platinum': return 'from-[#374151] to-[#111827] text-white';
      case 'gold': return 'from-[#ea580c] to-[#ca8a04] text-white';
      case 'silver': return 'from-[#6b7280] to-[#4b5563] text-white';
      default: return 'from-[#b45309] to-[#78350f] text-white';
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf9] text-[#563c37] flex flex-col font-sans selection:bg-[#fdba74]/30 selection:text-[#ea580c] animate-fade-in-page">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-page {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-slide-up-card {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Navbar */}
      <Navbar
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        navItems={navItems}
      />

      {/* Header section with Orange Gradient theme matching Redshan Flora */}
      <div className="pt-32 pb-12 text-center bg-gradient-to-br from-[#ea580c]/15 via-[#f97316]/5 to-transparent border-b border-[#f0ebe4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f97316]/10 text-[#ea580c] text-xs font-bold uppercase tracking-wider mb-4 border border-[#f97316]/20">
            <Sparkles size={12} className="text-[#ea580c]" />
            <span>Redshan Flora Club</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-[#563c37]" style={{ fontFamily: 'Playfair Display, serif' }}>
            ⭐ Loyalty Points
          </h1>
          <p className="text-xs md:text-sm text-[#563c37]/75 max-w-2xl mx-auto leading-relaxed">
            Manage your loyalty tier, view checkout discounts, and redeem point blocks to claim instant price cuts on your orders.
          </p>
        </div>
      </div>

      {/* Toast popup alerts */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-slide-up-card">
          <div className={`p-4 rounded-xl shadow-lg flex items-start gap-3 border ${
            toast.type === 'success'
              ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]'
              : 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]'
          }`}>
            <AlertCircle className="shrink-0 mt-0.5" size={16} />
            <div className="flex-1 text-xs font-semibold leading-normal">
              {toast.message}
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-xs font-bold uppercase tracking-wider hover:opacity-75"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main dashboard content container */}
      <main className="flex-1 py-12 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-12 lg:px-16 flex flex-col gap-10">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-[#ea580c]/30 border-t-[#ea580c] rounded-full animate-spin" />
            <p className="text-xs font-bold uppercase tracking-widest text-[#563c37]/60">Loading points ledger...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: TIER METRIC OVERVIEWS */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              
              {/* Dynamic Points Balance & Level Progress */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#f0ebe4] shadow-[0_4px_20px_rgba(86,60,55,0.02)] flex flex-col gap-6 text-left hover:shadow-[0_6px_25px_rgba(86,60,55,0.04)] transition-all">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#563c37]/50 block mb-1">
                      Available Points Balance
                    </span>
                    <h2 className="text-5xl font-bold text-[#563c37] flex items-baseline gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {loyalty.points} <span className="text-base font-semibold text-[#ea580c]">Points</span>
                    </h2>
                  </div>
                  <span className={`self-start px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-gradient-to-r ${getTierColorClass(loyalty.membership)}`}>
                    🥈 {loyalty.membership} Tier
                  </span>
                </div>

                {/* Progress calculation UI */}
                <div className="pt-2 border-t border-[#fdfbf9]">
                  <div className="flex justify-between text-xs font-semibold text-[#563c37] mb-2">
                    <span>Tier Progress Level</span>
                    <span className="text-[#ea580c] font-bold">Next Level: {loyalty.nextLevel} ({loyalty.pointsToNext} pts required)</span>
                  </div>
                  <div className="w-full bg-[#f5efeb] h-3 rounded-full overflow-hidden p-0.5 border border-[#ece7e2]">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-[#ea580c] h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${getProgressPercent()}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Membership Benefits Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#f0ebe4] shadow-[0_4px_20px_rgba(86,60,55,0.02)] text-left hover:shadow-[0_6px_25px_rgba(86,60,55,0.04)] transition-all">
                <div className="flex items-center gap-2.5 mb-6 border-b border-[#fdfbf9] pb-4">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 text-[#ea580c] flex items-center justify-center shrink-0">
                    <Award size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#563c37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Membership Benefits
                    </h3>
                    <p className="text-[10px] text-[#563c37]/50 mt-0.5">Higher point balances grant permanent percentage discounts on all orders.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tierBenefits.map((tb) => {
                    const isCurrent = tb.name.toLowerCase() === loyalty.membership?.toLowerCase();
                    return (
                      <div 
                        key={tb.name}
                        className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
                          isCurrent 
                            ? 'border-orange-500 bg-[#f97316]/5 ring-1 ring-orange-500/20 scale-[1.02] shadow-sm'
                            : 'border-[#f5efeb] bg-[#fdfbf9]/20 hover:border-[#ea580c]/15'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-extrabold text-xs uppercase tracking-wider text-[#563c37]">{tb.name}</span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#ea580c] bg-orange-100 px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-[#ea580c]" style={{ fontFamily: 'Playfair Display, serif' }}>
                            {tb.discount}
                          </span>
                          <span className="text-[10px] font-bold text-[#563c37]/60">Discount</span>
                        </div>
                        <p className="text-[10px] text-[#563c37]/65 mt-2 leading-relaxed">{tb.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: REDEMPTION & VOUCHER CONTROLS */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              
              {/* Redeem Points Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#f0ebe4] shadow-[0_4px_20px_rgba(86,60,55,0.02)] text-left hover:shadow-[0_6px_25px_rgba(86,60,55,0.04)] transition-all">
                <div className="flex items-center gap-2.5 mb-6 border-b border-[#fdfbf9] pb-4">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 text-[#ea580c] flex items-center justify-center shrink-0">
                    <Gift size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#563c37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      🎁 Redeem Points
                    </h3>
                    <p className="text-[10px] text-[#563c37]/50 mt-0.5">Points are converted to discount codes in multiples of 100.</p>
                  </div>
                </div>

                {/* Point Summary values list */}
                <div className="flex flex-col gap-4 text-xs font-semibold text-[#563c37] mb-6">
                  <div className="flex justify-between items-center py-2.5 border-b border-[#fdfbf9]">
                    <span className="text-[#563c37]/75 font-medium">Current Points</span>
                    <span className="text-sm font-extrabold text-[#563c37]">{checkoutData.points}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-[#fdfbf9]">
                    <span className="text-[#563c37]/75 font-medium">Redeemable Points</span>
                    <span className="text-sm font-extrabold text-[#ea580c]">{checkoutData.redeemablePoints}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-[#fdfbf9]">
                    <span className="text-[#563c37]/75 font-medium">💰 Discount</span>
                    <span className="text-sm font-extrabold text-green-600">Rs.{checkoutData.redeemDiscount}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-[#563c37]/75 font-medium">Remaining Points</span>
                    <span className="text-sm font-extrabold text-[#563c37]/70">{checkoutData.remainingPoints}</span>
                  </div>
                </div>

                {/* Redeem button */}
                <button
                  onClick={handleRedeemPoints}
                  disabled={isRedeeming || (checkoutData.redeemablePoints || 0) <= 0}
                  className={`w-full text-center py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 flex justify-center items-center gap-2 ${
                    (checkoutData.redeemablePoints || 0) > 0
                      ? 'bg-gradient-to-r from-orange-500 to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed active:scale-100'
                  }`}
                >
                  {isRedeeming ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Redeem Points</span>
                  )}
                </button>
                {(checkoutData.redeemablePoints || 0) <= 0 && (
                  <p className="text-[10px] text-[#563c37]/50 mt-3 text-center leading-relaxed font-semibold">
                    *Accumulate at least 100 loyalty points to generate discount codes.
                  </p>
                )}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LoyaltyPoints;
