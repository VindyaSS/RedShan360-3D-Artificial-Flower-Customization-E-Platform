import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MyOrdersModal from './components/MyOrdersModal';

const CustomerOrders = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fdfbf9] flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 bg-gradient-to-br from-[#8c5e5e]/5 via-[#ea580c]/5 to-transparent py-10" />
      <MyOrdersModal isOpen={true} onClose={() => navigate('/guestUserDashboard')} />
      <Footer />
    </div>
  );
};

export default CustomerOrders;
