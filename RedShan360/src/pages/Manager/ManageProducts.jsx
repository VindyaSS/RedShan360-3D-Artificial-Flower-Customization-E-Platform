import React, { useState, useEffect } from 'react';
import '../../css/manager.css';
import SideNavigation from '../../components/managerComponent/sideNavigation';
import SearchBarM from '../../components/managerComponent/searchBarM';
import SubNavbarM from '../../components/managerComponent/subNavbarM';
import MAddNewProductForm from '../../components/managerComponent/MAddNewProductForm';
import MAddProductButton from '../../components/managerComponent/MAddProductButton';
import { Plus, X } from 'lucide-react';
import AniversaryBFlowerCard from '../../components/managerComponent/AniversaryBFlowerCard';
import AnniversaryIFlowerCard from '../../components/managerComponent/AnniversaryIFlowerCard';
import BirthdayBFlowerCard from '../../components/managerComponent/BirthdayBFlowerCard';
import BirthdayIFlowerCard from '../../components/managerComponent/BirthdayIFlowerCard';
import BirthdayHeaddressCard from '../../components/managerComponent/BirthdayHeaddressCard';
import ConvocationBFlowerCard from '../../components/managerComponent/ConvocationBFlowerCard';
import ConvocationIFlowerCard from '../../components/managerComponent/ConvocationIFlowerCard';
import axios from "axios";

// Import Images for Anniversary Boquets
import A1 from '../../assets/A1.jpg';
import A2 from '../../assets/A2.jpg';
import A3 from '../../assets/A3.jpg';
import A4 from '../../assets/A4.jpg';
import A5 from '../../assets/A5.jpg';
import A6 from '../../assets/A6.jpg';

// Import Images for Anniversary Individual Flowers
import AI1 from '../../assets/AI1.jpg';
import AI2 from '../../assets/AI2.jpg';
import AI3 from '../../assets/AI3.jpg';
import AI4 from '../../assets/AI4.jpg';
import AI5 from '../../assets/AI5.jpg';
import AI6 from '../../assets/AI6.jpg';
import AI7 from '../../assets/AI7.jpg';

// Import Images for Birthday Boquets
import ABB1 from '../../assets/ABB1.jpg';
import ABB2 from '../../assets/ABB2.jpg';
import ABB3 from '../../assets/ABB3.jpg';
import ABB4 from '../../assets/ABB4.jpg';
import ABB5 from '../../assets/ABB5.jpg';
import ABB6 from '../../assets/ABB6.jpg';

// Import Images for Birthday Individual Flowers
import BI1 from '../../assets/BI1.jpg';
import BI2 from '../../assets/BI2.jpg';
import BI3 from '../../assets/BI3.jpg';
import BI4 from '../../assets/BI4.jpg';
import BI5 from '../../assets/BI5.jpg';

// Import Images for Birthday Headdresses
import BH1 from '../../assets/BH1.jpg';
import BH2 from '../../assets/BH2.jpg';
import BH3 from '../../assets/BH3.jpg';
import BH4 from '../../assets/BH4.jpg';
import BH5 from '../../assets/BH5.jpg';

// Import Images for Convocation Boquets
import C1 from '../../assets/C1.jpg';
import C2 from '../../assets/C2.jpg';
import C3 from '../../assets/C3.jpg';
import C4 from '../../assets/C4.jpg';
import C5 from '../../assets/C5.jpg';
import C6 from '../../assets/C6.jpg';
import C7 from '../../assets/C7.jpg';
import C8 from '../../assets/C8.jpg';

// Import Images for Convocation Individual Flowers
import CI1 from '../../assets/CI1.jpg';
import CI2 from '../../assets/CI2.jpg';
import CI3 from '../../assets/CI3.jpg';
import CI4 from '../../assets/CI4.jpg';
import CI5 from '../../assets/CI5.jpg';
import CI6 from '../../assets/CI6.jpg';
import CI7 from '../../assets/CI7.jpg';

export default function MmanageProducts() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSector, setActiveSector] = useState('All');

    // Toggle state for Add Product Form
    const [isAddingProduct, setIsAddingProduct] = useState(false);

    // Success toast notification
    const [successNotification, setSuccessNotification] = useState(null);

    // Anniversary Bouquets State
    const [anniversaryBouquets, setAnniversaryBouquets] = useState([
        { id: 1, BoquetName: "Luxury Crimson Romance", Price: "Rs 5,500.00", quantity: 12, image: A1 },
        { id: 2, BoquetName: "Ethereal Pastel Dream", Price: "Rs 6,200.00", quantity: 8, image: A2 },
        { id: 3, BoquetName: "Royal Velvet Blush", Price: "Rs 7,000.00", quantity: 3, image: A3 },
        { id: 4, BoquetName: "Classic Golden Grace", Price: "Rs 6,500.00", quantity: 15, image: A4 },
        { id: 5, BoquetName: "Whispering Lily White", Price: "Rs 4,800.00", quantity: 0, image: A5 },
        { id: 6, BoquetName: "Enchanted Garden Bloom", Price: "Rs 8,500.00", quantity: 6, image: A6 }
    ]);

    // Anniversary Individual Flowers State
    const [anniversaryIndividualFlowers, setAnniversaryIndividualFlowers] = useState([
        { id: 1, FlowerName: "Crimson Silk Rose Stem", Price: "Rs 1,200.00", quantity: 24, image: AI1 },
        { id: 2, FlowerName: "Ethereal White Lily Stem", Price: "Rs 1,500.00", quantity: 18, image: AI2 },
        { id: 3, FlowerName: "Velvet Blush Peony Stem", Price: "Rs 1,800.00", quantity: 9, image: AI3 },
        { id: 4, FlowerName: "Golden Grace Tulip Stem", Price: "Rs 1,350.00", quantity: 30, image: AI4 },
        { id: 5, FlowerName: "Serene Hydrangea Stem", Price: "Rs 2,100.00", quantity: 4, image: AI5 },
        { id: 7, FlowerName: "Orchid Splendor Stem", Price: "Rs 2,400.00", quantity: 15, image: AI6 },
        { id: 8, FlowerName: "Mystique Iris Stem", Price: "Rs 1,650.00", quantity: 0, image: AI7 }
    ]);

    // Birthday FlowerBoquets State
    const [birthdayBoquetFlowers, setBirthdayBoquetFlowers] = useState([
        { id: 1, FlowerName: "Crimson Silk Rose Stem", Price: "Rs 1,200.00", quantity: 24, image: ABB1 },
        { id: 2, FlowerName: "Ethereal White Lily Stem", Price: "Rs 1,500.00", quantity: 18, image: ABB2 },
        { id: 3, FlowerName: "Velvet Blush Peony Stem", Price: "Rs 1,800.00", quantity: 9, image: ABB3 },
        { id: 4, FlowerName: "Golden Grace Tulip Stem", Price: "Rs 1,350.00", quantity: 30, image: ABB4 },
        { id: 5, FlowerName: "Serene Hydrangea Stem", Price: "Rs 2,100.00", quantity: 4, image: ABB5 },
        { id: 6, FlowerName: "Orchid Splendor Stem", Price: "Rs 2,400.00", quantity: 15, image: ABB6 }
    ]);

    // Birthday Individual Flowers State
    const [birthdayIndividualFlowers, setBirthdayIndividualFlowers] = useState([
        { id: 1, FlowerName: "Sun-Kissed Yellow Daisy Stem", Price: "Rs 950.00", quantity: 20, image: BI1 },
        { id: 2, FlowerName: "Pink Grace Rose Stem", Price: "Rs 1,100.00", quantity: 15, image: BI2 },
        { id: 3, FlowerName: "Purple Magic Orchid Stem", Price: "Rs 850.00", quantity: 35, image: BI3 },
        { id: 4, FlowerName: "Blushing Tulip Stem", Price: "Rs 1,200.00", quantity: 0, image: BI4 },
        { id: 5, FlowerName: "White Celebration Lily Stem", Price: "Rs 1,500.00", quantity: 5, image: BI5 }
    ]);

    // Birthday Headdresses State
    const [birthdayHeaddresses, setBirthdayHeaddresses] = useState([
        { id: 1, HeaddressName: "Floral Queen Crown", Price: "Rs 2,500.00", quantity: 8, image: BH1 },
        { id: 2, HeaddressName: "Rose Petal Tiara", Price: "Rs 1,800.00", quantity: 12, image: BH2 },
        { id: 3, HeaddressName: "Blossom Headband Elegance", Price: "Rs 1,500.00", quantity: 0, image: BH3 },
        { id: 4, HeaddressName: "Jasmine Dream Wreath", Price: "Rs 2,200.00", quantity: 4, image: BH4 },
        { id: 5, HeaddressName: "Golden Lily Halo", Price: "Rs 3,000.00", quantity: 15, image: BH5 }
    ]);

    // Convocation Bouquets State
    const [convocationBouquets, setConvocationBouquets] = useState([
        { id: 1, BoquetName: "Academic Achievement Bloom", Price: "Rs 4,500.00", quantity: 10, image: C1 },
        { id: 2, BoquetName: "Graduation Golden Glory", Price: "Rs 5,200.00", quantity: 7, image: C2 },
        { id: 3, BoquetName: "Success Sapphire Sparkle", Price: "Rs 6,000.00", quantity: 0, image: C3 },
        { id: 4, BoquetName: "Scholar's Crimson Pride", Price: "Rs 5,800.00", quantity: 14, image: C4 },
        { id: 5, BoquetName: "Valedictorian Violet Dream", Price: "Rs 4,200.00", quantity: 3, image: C5 },
        { id: 6, BoquetName: "Triumphant Sunflower Burst", Price: "Rs 7,500.00", quantity: 8, image: C6 },
        { id: 7, BoquetName: "Honors Lavender Elegance", Price: "Rs 5,000.00", quantity: 12, image: C7 },
        { id: 8, BoquetName: "Commencement Pastel Harmony", Price: "Rs 6,800.00", quantity: 5, image: C8 }
    ]);

    // Convocation Individual Flowers State
    const [convocationIndividualFlowers, setConvocationIndividualFlowers] = useState([
        { id: 1, FlowerName: "Scholar's Crimson Rose Stem", Price: "Rs 1,300.00", quantity: 15, image: CI1 },
        { id: 2, FlowerName: "Success Golden Lily Stem", Price: "Rs 1,600.00", quantity: 20, image: CI2 },
        { id: 3, FlowerName: "Academic Orchid Stem", Price: "Rs 1,900.00", quantity: 6, image: CI3 },
        { id: 4, FlowerName: "Triumphant Tulip Stem", Price: "Rs 1,450.00", quantity: 25, image: CI4 },
        { id: 5, FlowerName: "Graduation Hydrangea Stem", Price: "Rs 2,200.00", quantity: 8, image: CI5 },
        { id: 6, FlowerName: "Honors Lavender Stem", Price: "Rs 1,750.00", quantity: 0, image: CI6 },
        { id: 7, FlowerName: "Valedictorian Iris Stem", Price: "Rs 1,800.00", quantity: 11, image: CI7 }
    ]);

    // Auto-clear notification after 4 seconds
    useEffect(() => {
        if (successNotification) {
            const timer = setTimeout(() => {
                setSuccessNotification(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [successNotification]);

    // Filter bouquets based on search query
    const filteredBouquets = anniversaryBouquets.filter(bouquet =>
        (bouquet.BoquetName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter individual flowers based on search query
    const filteredIndividualFlowers = anniversaryIndividualFlowers.filter(flower =>
        (flower.FlowerName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter birthday bouquets based on search query
    const filteredBirthdayBouquets = birthdayBoquetFlowers.filter(bouquet =>
        (bouquet.FlowerName || bouquet.BoquetName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter birthday individual flowers based on search query
    const filteredBirthdayIndividualFlowers = birthdayIndividualFlowers.filter(flower =>
        (flower.FlowerName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter birthday headdresses based on search query
    const filteredBirthdayHeaddresses = birthdayHeaddresses.filter(headdress =>
        (headdress.HeaddressName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter convocation bouquets based on search query
    const filteredConvocationBouquets = convocationBouquets.filter(bouquet =>
        (bouquet.BoquetName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter convocation individual flowers based on search query
    const filteredConvocationIndividualFlowers = convocationIndividualFlowers.filter(flower =>
        (flower.FlowerName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (id, type, newPrice) => {
        if (type === 'Bouquet') {
            setAnniversaryBouquets(prev => prev.map(b => b.id === id ? { ...b, Price: newPrice } : b));
        } else if (type === 'Individual Flower') {
            setAnniversaryIndividualFlowers(prev => prev.map(f => f.id === id ? { ...f, Price: newPrice } : f));
        } else if (type === 'Birthday Bouquet') {
            setBirthdayBoquetFlowers(prev => prev.map(b => b.id === id ? { ...b, Price: newPrice } : b));
        } else if (type === 'Birthday Individual Flower') {
            setBirthdayIndividualFlowers(prev => prev.map(f => f.id === id ? { ...f, Price: newPrice } : f));
        } else if (type === 'Birthday Headdress') {
            setBirthdayHeaddresses(prev => prev.map(h => h.id === id ? { ...h, Price: newPrice } : h));
        } else if (type === 'Convocation Bouquet') {
            setConvocationBouquets(prev => prev.map(b => b.id === id ? { ...b, Price: newPrice } : b));
        } else if (type === 'Convocation Individual Flower') {
            setConvocationIndividualFlowers(prev => prev.map(f => f.id === id ? { ...f, Price: newPrice } : f));
        }
        setSuccessNotification(`Price updated to ${newPrice} successfully.`);
    };

    const handleDelete = (id, type) => {
        if (window.confirm("Are you sure delete product?")) {
            if (type === 'Bouquet') {
                setAnniversaryBouquets(prev => prev.filter(b => b.id !== id));
            } else if (type === 'Individual Flower') {
                setAnniversaryIndividualFlowers(prev => prev.filter(f => f.id !== id));
            } else if (type === 'Birthday Bouquet') {
                setBirthdayBoquetFlowers(prev => prev.filter(b => b.id !== id));
            } else if (type === 'Birthday Individual Flower') {
                setBirthdayIndividualFlowers(prev => prev.filter(f => f.id !== id));
            } else if (type === 'Birthday Headdress') {
                setBirthdayHeaddresses(prev => prev.filter(h => h.id !== id));
            } else if (type === 'Convocation Bouquet') {
                setConvocationBouquets(prev => prev.filter(b => b.id !== id));
            } else if (type === 'Convocation Individual Flower') {
                setConvocationIndividualFlowers(prev => prev.filter(f => f.id !== id));
            }
            setSuccessNotification(`${type} deleted successfully.`);
        }
    };

    import axios from "axios";

    const handleAddNewProduct = async (newProduct) => {
        try {

            const categoryMap = {
                Anniversary: 1,
                Birthday: 2,
                Convocation: 3
            };

            const subCategoryMap = {
                "Boquet": 1,
                "Individual Flowers": 2,
                "Headdress": 3
            };

            const productDTO = {
                categoryId: categoryMap[newProduct.category],
                subCategoryId: subCategoryMap[newProduct.subcategory],
                productName: newProduct.productName,
                description: newProduct.description,
                price: Number(newProduct.price),
                stockQuantity: Number(newProduct.stockQuantity),
                imageUrl: newProduct.image
            };

            await axios.post(
                "http://localhost:8080/api/products/add",
                productDTO
            );

            setSuccessNotification("Product added successfully.");
            setIsAddingProduct(false);

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data ||
                "Failed to add product."
            );
        }
    };
    // Set active sector to the newly added product's category & subcategory so it's shown immediately
    setActiveSector(`${category} - ${subcategory === 'Boquet' ? 'Boquets' : subcategory === 'Headdress' ? 'Head Dresses' : subcategory}`);

    // Set success notification
    setSuccessNotification(`Product "${productName}" successfully added to ${category} - ${subcategory === 'Boquet' ? 'Bouquet' : subcategory}!`);
    setIsAddingProduct(false);
};

return (
    <>
        {successNotification && (
            <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 bg-[#eefaf4] border border-emerald-100 text-green-800 rounded-2xl shadow-xl animate-slideIn">
                <span className="p-1.5 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </span>
                <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-sm text-emerald-950">Success!</span>
                    <span className="text-xs text-emerald-700 font-medium">{successNotification}</span>
                </div>
                <button
                    onClick={() => setSuccessNotification(null)}
                    className="ml-4 p-1 text-emerald-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                    <X size={14} />
                </button>
            </div>
        )}

        <div className="MPage">
            <div className="Mpart1">
                <SideNavigation />
            </div>
            <div className="Mpart2" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Top Bar with Search, SubNavbar and Add Product Button */}
                <div className="flex flex-col gap-4 border-b border-[#e5e4e7] pb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <SearchBarM
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClear={() => setSearchQuery('')}
                            placeholder="search product"
                        />
                        <SubNavbarM
                            activeSector={activeSector}
                            onSectorChange={setActiveSector}
                        />
                    </div>
                    {!isAddingProduct && (
                        <div className="flex items-start">
                            <MAddProductButton onClick={() => setIsAddingProduct(true)} />
                        </div>
                    )}
                </div>

                {/* Dashboard Content area */}
                <div className="flex-1">
                    {isAddingProduct ? (
                        <MAddNewProductForm
                            onClose={() => setIsAddingProduct(false)}
                            onSubmit={handleAddNewProduct}
                        />
                    ) : activeSector === 'All' ? (
                        <div className="flex flex-col gap-12">
                            {/* All - Boquets */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-[#1a1a1a] font-sans">
                                        All - Boquets
                                    </h2>
                                    <span className="text-xs font-semibold text-[#666] bg-[#744F51]/5 border border-[#744F51]/10 px-3 py-1.5 rounded-lg">
                                        Showing {filteredBouquets.length + filteredBirthdayBouquets.length + filteredConvocationBouquets.length} of {anniversaryBouquets.length + birthdayBoquetFlowers.length + convocationBouquets.length} bouquets
                                    </span>
                                </div>

                                {filteredBouquets.length + filteredBirthdayBouquets.length + filteredConvocationBouquets.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredBouquets.map((bouquet) => (
                                            <AniversaryBFlowerCard
                                                key={`all-anniversary-${bouquet.id}`}
                                                image={bouquet.image}
                                                quantity={bouquet.quantity}
                                                BoquetName={bouquet.BoquetName}
                                                Price={bouquet.Price}
                                                onEdit={(newPrice) => handleEdit(bouquet.id, 'Bouquet', newPrice)}
                                                onDelete={() => handleDelete(bouquet.id, 'Bouquet')}
                                            />
                                        ))}
                                        {filteredBirthdayBouquets.map((bouquet) => (
                                            <BirthdayBFlowerCard
                                                key={`all-birthday-${bouquet.id}`}
                                                image={bouquet.image}
                                                quantity={bouquet.quantity}
                                                BoquetName={bouquet.FlowerName || bouquet.BoquetName}
                                                Price={bouquet.Price}
                                                onEdit={(newPrice) => handleEdit(bouquet.id, 'Birthday Bouquet', newPrice)}
                                                onDelete={() => handleDelete(bouquet.id, 'Birthday Bouquet')}
                                            />
                                        ))}
                                        {filteredConvocationBouquets.map((bouquet) => (
                                            <ConvocationBFlowerCard
                                                key={`all-convocation-${bouquet.id}`}
                                                image={bouquet.image}
                                                quantity={bouquet.quantity}
                                                BoquetName={bouquet.BoquetName}
                                                Price={bouquet.Price}
                                                onEdit={(newPrice) => handleEdit(bouquet.id, 'Convocation Bouquet', newPrice)}
                                                onDelete={() => handleDelete(bouquet.id, 'Convocation Bouquet')}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-white border border-[#e5e4e7] rounded-2xl shadow-sm text-[#666] font-medium">
                                        No bouquets found matching "{searchQuery}"
                                    </div>
                                )}
                            </div>

                            {/* All - Individual Flowers */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-[#1a1a1a] font-sans">
                                        All - Individual Flowers
                                    </h2>
                                    <span className="text-xs font-semibold text-[#666] bg-[#744F51]/5 border border-[#744F51]/10 px-3 py-1.5 rounded-lg">
                                        Showing {filteredIndividualFlowers.length + filteredBirthdayIndividualFlowers.length + filteredConvocationIndividualFlowers.length} of {anniversaryIndividualFlowers.length + birthdayIndividualFlowers.length + convocationIndividualFlowers.length} flowers
                                    </span>
                                </div>

                                {filteredIndividualFlowers.length + filteredBirthdayIndividualFlowers.length + filteredConvocationIndividualFlowers.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredIndividualFlowers.map((flower) => (
                                            <AnniversaryIFlowerCard
                                                key={`all-anniversary-flower-${flower.id}`}
                                                image={flower.image}
                                                quantity={flower.quantity}
                                                FlowerName={flower.FlowerName}
                                                Price={flower.Price}
                                                onEdit={(newPrice) => handleEdit(flower.id, 'Individual Flower', newPrice)}
                                                onDelete={() => handleDelete(flower.id, 'Individual Flower')}
                                            />
                                        ))}
                                        {filteredBirthdayIndividualFlowers.map((flower) => (
                                            <BirthdayIFlowerCard
                                                key={`all-birthday-flower-${flower.id}`}
                                                image={flower.image}
                                                quantity={flower.quantity}
                                                FlowerName={flower.FlowerName}
                                                Price={flower.Price}
                                                onEdit={(newPrice) => handleEdit(flower.id, 'Birthday Individual Flower', newPrice)}
                                                onDelete={() => handleDelete(flower.id, 'Birthday Individual Flower')}
                                            />
                                        ))}
                                        {filteredConvocationIndividualFlowers.map((flower) => (
                                            <ConvocationIFlowerCard
                                                key={`all-convocation-flower-${flower.id}`}
                                                image={flower.image}
                                                quantity={flower.quantity}
                                                BoquetName={flower.FlowerName}
                                                Price={flower.Price}
                                                onEdit={(newPrice) => handleEdit(flower.id, 'Convocation Individual Flower', newPrice)}
                                                onDelete={() => handleDelete(flower.id, 'Convocation Individual Flower')}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-white border border-[#e5e4e7] rounded-2xl shadow-sm text-[#666] font-medium">
                                        No individual flowers found matching "{searchQuery}"
                                    </div>
                                )}
                            </div>

                            {/* All - Head Dresses */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-[#1a1a1a] font-sans">
                                        All - Head Dresses
                                    </h2>
                                    <span className="text-xs font-semibold text-[#666] bg-[#744F51]/5 border border-[#744F51]/10 px-3 py-1.5 rounded-lg">
                                        Showing {filteredBirthdayHeaddresses.length} of {birthdayHeaddresses.length} headdresses
                                    </span>
                                </div>

                                {filteredBirthdayHeaddresses.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredBirthdayHeaddresses.map((headdress) => (
                                            <BirthdayHeaddressCard
                                                key={`all-birthday-headdress-${headdress.id}`}
                                                image={headdress.image}
                                                quantity={headdress.quantity}
                                                HeaddressName={headdress.HeaddressName}
                                                Price={headdress.Price}
                                                onEdit={(newPrice) => handleEdit(headdress.id, 'Birthday Headdress', newPrice)}
                                                onDelete={() => handleDelete(headdress.id, 'Birthday Headdress')}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-white border border-[#e5e4e7] rounded-2xl shadow-sm text-[#666] font-medium">
                                        No headdresses found matching "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : activeSector === 'All - Boquets' ? (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-[#1a1a1a] font-sans">
                                    All - Boquets
                                </h2>
                                <span className="text-xs font-semibold text-[#666] bg-[#744F51]/5 border border-[#744F51]/10 px-3 py-1.5 rounded-lg">
                                    Showing {filteredBouquets.length + filteredBirthdayBouquets.length + filteredConvocationBouquets.length} of {anniversaryBouquets.length + birthdayBoquetFlowers.length + convocationBouquets.length} bouquets
                                </span>
                            </div>

                            {filteredBouquets.length + filteredBirthdayBouquets.length + filteredConvocationBouquets.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredBouquets.map((bouquet) => (
                                        <AniversaryBFlowerCard
                                            key={`anniversary-${bouquet.id}`}
                                            image={bouquet.image}
                                            quantity={bouquet.quantity}
                                            BoquetName={bouquet.BoquetName}
                                            Price={bouquet.Price}
                                            onEdit={(newPrice) => handleEdit(bouquet.id, 'Bouquet', newPrice)}
                                            onDelete={() => handleDelete(bouquet.id, 'Bouquet')}
                                        />
                                    ))}
                                    {filteredBirthdayBouquets.map((bouquet) => (
                                        <BirthdayBFlowerCard
                                            key={`birthday-${bouquet.id}`}
                                            image={bouquet.image}
                                            quantity={bouquet.quantity}
                                            BoquetName={bouquet.FlowerName || bouquet.BoquetName}
                                            Price={bouquet.Price}
                                            onEdit={(newPrice) => handleEdit(bouquet.id, 'Birthday Bouquet', newPrice)}
                                            onDelete={() => handleDelete(bouquet.id, 'Birthday Bouquet')}
                                        />
                                    ))}
                                    {filteredConvocationBouquets.map((bouquet) => (
                                        <ConvocationBFlowerCard
                                            key={`convocation-${bouquet.id}`}
                                            image={bouquet.image}
                                            quantity={bouquet.quantity}
                                            BoquetName={bouquet.BoquetName}
                                            Price={bouquet.Price}
                                            onEdit={(newPrice) => handleEdit(bouquet.id, 'Convocation Bouquet', newPrice)}
                                            onDelete={() => handleDelete(bouquet.id, 'Convocation Bouquet')}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white border border-[#e5e4e7] rounded-2xl shadow-sm text-[#666] font-medium">
                                    No bouquets found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    ) : activeSector === 'All - Individual Flowers' ? (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-[#1a1a1a] font-sans">
                                    All - Individual Flowers
                                </h2>
                                <span className="text-xs font-semibold text-[#666] bg-[#744F51]/5 border border-[#744F51]/10 px-3 py-1.5 rounded-lg">
                                    Showing {filteredIndividualFlowers.length + filteredBirthdayIndividualFlowers.length + filteredConvocationIndividualFlowers.length} of {anniversaryIndividualFlowers.length + birthdayIndividualFlowers.length + convocationIndividualFlowers.length} flowers
                                </span>
                            </div>

                            {filteredIndividualFlowers.length + filteredBirthdayIndividualFlowers.length + filteredConvocationIndividualFlowers.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredIndividualFlowers.map((flower) => (
                                        <AnniversaryIFlowerCard
                                            key={`anniversary-flower-${flower.id}`}
                                            image={flower.image}
                                            quantity={flower.quantity}
                                            FlowerName={flower.FlowerName}
                                            Price={flower.Price}
                                            onEdit={(newPrice) => handleEdit(flower.id, 'Individual Flower', newPrice)}
                                            onDelete={() => handleDelete(flower.id, 'Individual Flower')}
                                        />
                                    ))}
                                    {filteredBirthdayIndividualFlowers.map((flower) => (
                                        <BirthdayIFlowerCard
                                            key={`birthday-flower-${flower.id}`}
                                            image={flower.image}
                                            quantity={flower.quantity}
                                            FlowerName={flower.FlowerName}
                                            Price={flower.Price}
                                            onEdit={(newPrice) => handleEdit(flower.id, 'Birthday Individual Flower', newPrice)}
                                            onDelete={() => handleDelete(flower.id, 'Birthday Individual Flower')}
                                        />
                                    ))}
                                    {filteredConvocationIndividualFlowers.map((flower) => (
                                        <ConvocationIFlowerCard
                                            key={`convocation-flower-${flower.id}`}
                                            image={flower.image}
                                            quantity={flower.quantity}
                                            BoquetName={flower.FlowerName}
                                            Price={flower.Price}
                                            onEdit={(newPrice) => handleEdit(flower.id, 'Convocation Individual Flower', newPrice)}
                                            onDelete={() => handleDelete(flower.id, 'Convocation Individual Flower')}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white border border-[#e5e4e7] rounded-2xl shadow-sm text-[#666] font-medium">
                                    No individual flowers found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    ) : activeSector === 'All - Head Dresses' ? (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-[#1a1a1a] font-sans">
                                    All - Head Dresses
                                </h2>
                                <span className="text-xs font-semibold text-[#666] bg-[#744F51]/5 border border-[#744F51]/10 px-3 py-1.5 rounded-lg">
                                    Showing {filteredBirthdayHeaddresses.length} of {birthdayHeaddresses.length} headdresses
                                </span>
                            </div>

                            {filteredBirthdayHeaddresses.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredBirthdayHeaddresses.map((headdress) => (
                                        <BirthdayHeaddressCard
                                            key={`birthday-headdress-${headdress.id}`}
                                            image={headdress.image}
                                            quantity={headdress.quantity}
                                            HeaddressName={headdress.HeaddressName}
                                            Price={headdress.Price}
                                            onEdit={(newPrice) => handleEdit(headdress.id, 'Birthday Headdress', newPrice)}
                                            onDelete={() => handleDelete(headdress.id, 'Birthday Headdress')}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white border border-[#e5e4e7] rounded-2xl shadow-sm text-[#666] font-medium">
                                    No headdresses found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    ) : activeSector === 'Anniversary - Boquets' ? (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-[#1a1a1a] font-sans">
                                    Anniversary - Boquets
                                </h2>
                                <span className="text-xs font-semibold text-[#666] bg-[#744F51]/5 border border-[#744F51]/10 px-3 py-1.5 rounded-lg">
                                    Showing {filteredBouquets.length} of {anniversaryBouquets.length} bouquets
                                </span>
                            </div>

                            {filteredBouquets.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredBouquets.map((bouquet) => (
                                        <AniversaryBFlowerCard
                                            key={bouquet.id}
                                            image={bouquet.image}
                                            quantity={bouquet.quantity}
                                            BoquetName={bouquet.BoquetName}
                                            Price={bouquet.Price}
                                            onEdit={(newPrice) => handleEdit(bouquet.id, 'Bouquet', newPrice)}
                                            onDelete={() => handleDelete(bouquet.id, 'Bouquet')}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white border border-[#e5e4e7] rounded-2xl shadow-sm text-[#666] font-medium">
                                    No bouquets found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    ) : activeSector === 'Anniversary - Individual Flowers' ? (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-[#1a1a1a] font-sans">
                                    Anniversary - Individual Flowers
                                </h2>
                                <span className="text-xs font-semibold text-[#666] bg-[#744F51]/5 border border-[#744F51]/10 px-3 py-1.5 rounded-lg">
                                    Showing {filteredIndividualFlowers.length} of {anniversaryIndividualFlowers.length} flowers
                                </span>
                            </div>

                            {filteredIndividualFlowers.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredIndividualFlowers.map((flower) => (
                                        <AnniversaryIFlowerCard
                                            key={flower.id}
                                            image={flower.image}
                                            quantity={flower.quantity}
                                            FlowerName={flower.FlowerName}
                                            Price={flower.Price}
                                            onEdit={(newPrice) => handleEdit(flower.id, 'Individual Flower', newPrice)}
                                            onDelete={() => handleDelete(flower.id, 'Individual Flower')}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white border border-[#e5e4e7] rounded-2xl shadow-sm text-[#666] font-medium">
                                    No individual flowers found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    ) : activeSector === 'Birthday - Boquets' ? (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-[#1a1a1a] font-sans">
                                    Birthday - Boquets
                                </h2>
                                <span className="text-xs font-semibold text-[#666] bg-[#744F51]/5 border border-[#744F51]/10 px-3 py-1.5 rounded-lg">
                                    Showing {filteredBirthdayBouquets.length} of {birthdayBoquetFlowers.length} bouquets
                                </span>
                            </div>

                            {filteredBirthdayBouquets.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredBirthdayBouquets.map((bouquet) => (
                                        <BirthdayBFlowerCard
                                            key={bouquet.id}
                                            image={bouquet.image}
                                            quantity={bouquet.quantity}
                                            BoquetName={bouquet.FlowerName || bouquet.BoquetName}
                                            Price={bouquet.Price}
                                            onEdit={(newPrice) => handleEdit(bouquet.id, 'Birthday Bouquet', newPrice)}
                                            onDelete={() => handleDelete(bouquet.id, 'Birthday Bouquet')}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white border border-[#e5e4e7] rounded-2xl shadow-sm text-[#666] font-medium">
                                    No bouquets found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    ) : activeSector === 'Birthday - Individual Flowers' ? (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-[#1a1a1a] font-sans">
                                    Birthday - Individual Flowers
                                </h2>
                                <span className="text-xs font-semibold text-[#666] bg-[#744F51]/5 border border-[#744F51]/10 px-3 py-1.5 rounded-lg">
                                    Showing {filteredBirthdayIndividualFlowers.length} of {birthdayIndividualFlowers.length} flowers
                                </span>
                            </div>

                            {filteredBirthdayIndividualFlowers.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredBirthdayIndividualFlowers.map((flower) => (
                                        <BirthdayIFlowerCard
                                            key={flower.id}
                                            image={flower.image}
                                            quantity={flower.quantity}
                                            FlowerName={flower.FlowerName}
                                            Price={flower.Price}
                                            onEdit={(newPrice) => handleEdit(flower.id, 'Birthday Individual Flower', newPrice)}
                                            onDelete={() => handleDelete(flower.id, 'Birthday Individual Flower')}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white border border-[#e5e4e7] rounded-2xl shadow-sm text-[#666] font-medium">
                                    No individual flowers found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    ) : activeSector === 'Birthday - Head Dresses' ? (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-[#1a1a1a] font-sans">
                                    Birthday - Head Dresses
                                </h2>
                                <span className="text-xs font-semibold text-[#666] bg-[#744F51]/5 border border-[#744F51]/10 px-3 py-1.5 rounded-lg">
                                    Showing {filteredBirthdayHeaddresses.length} of {birthdayHeaddresses.length} headdresses
                                </span>
                            </div>

                            {filteredBirthdayHeaddresses.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredBirthdayHeaddresses.map((headdress) => (
                                        <BirthdayHeaddressCard
                                            key={headdress.id}
                                            image={headdress.image}
                                            quantity={headdress.quantity}
                                            HeaddressName={headdress.HeaddressName}
                                            Price={headdress.Price}
                                            onEdit={(newPrice) => handleEdit(headdress.id, 'Birthday Headdress', newPrice)}
                                            onDelete={() => handleDelete(headdress.id, 'Birthday Headdress')}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white border border-[#e5e4e7] rounded-2xl shadow-sm text-[#666] font-medium">
                                    No headdresses found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    ) : activeSector === 'Convocation - Boquets' ? (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-[#1a1a1a] font-sans">
                                    Convocation - Boquets
                                </h2>
                                <span className="text-xs font-semibold text-[#666] bg-[#744F51]/5 border border-[#744F51]/10 px-3 py-1.5 rounded-lg">
                                    Showing {filteredConvocationBouquets.length} of {convocationBouquets.length} bouquets
                                </span>
                            </div>

                            {filteredConvocationBouquets.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredConvocationBouquets.map((bouquet) => (
                                        <ConvocationBFlowerCard
                                            key={bouquet.id}
                                            image={bouquet.image}
                                            quantity={bouquet.quantity}
                                            BoquetName={bouquet.BoquetName}
                                            Price={bouquet.Price}
                                            onEdit={(newPrice) => handleEdit(bouquet.id, 'Convocation Bouquet', newPrice)}
                                            onDelete={() => handleDelete(bouquet.id, 'Convocation Bouquet')}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white border border-[#e5e4e7] rounded-2xl shadow-sm text-[#666] font-medium">
                                    No bouquets found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    ) : activeSector === 'Convocation - Individual Flowers' ? (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-[#1a1a1a] font-sans">
                                    Convocation - Individual Flowers
                                </h2>
                                <span className="text-xs font-semibold text-[#666] bg-[#744F51]/5 border border-[#744F51]/10 px-3 py-1.5 rounded-lg">
                                    Showing {filteredConvocationIndividualFlowers.length} of {convocationIndividualFlowers.length} flowers
                                </span>
                            </div>

                            {filteredConvocationIndividualFlowers.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredConvocationIndividualFlowers.map((flower) => (
                                        <ConvocationIFlowerCard
                                            key={flower.id}
                                            image={flower.image}
                                            quantity={flower.quantity}
                                            BoquetName={flower.FlowerName}
                                            Price={flower.Price}
                                            onEdit={(newPrice) => handleEdit(flower.id, 'Convocation Individual Flower', newPrice)}
                                            onDelete={() => handleDelete(flower.id, 'Convocation Individual Flower')}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white border border-[#e5e4e7] rounded-2xl shadow-sm text-[#666] font-medium">
                                    No individual flowers found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-[#e5e4e7] rounded-2xl shadow-sm gap-3">
                            <h3 className="text-base font-semibold text-[#1a1a1a]">Select a Subsector from the Navbar</h3>
                            <p className="text-sm text-[#666] max-w-sm">
                                Please open a dropdown list in the sub-navbar and click a category (like All &rarr; Boquets, All &rarr; Individual Flowers, All &rarr; Head Dresses, Anniversary &rarr; Boquets, Anniversary &rarr; Individual Flowers, Birthday &rarr; Boquets, Birthday &rarr; Individual Flowers, Birthday &rarr; Head Dresses, Convocation &rarr; Boquets, or Convocation &rarr; Individual Flowers) to view cards.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>
);
}