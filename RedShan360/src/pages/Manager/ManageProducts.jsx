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
import api from '../../services/api';

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

    // Products List state loaded from Backend REST API
    const [productsList, setProductsList] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/api/products');
            setProductsList(response.data);

            console.log(response.data);

        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Image resolver helper to map products dynamically to either database images or fallback local assets
    const getProductImage = (product) => {
        if (product.imageUrl) {
            return `http://localhost:8080${product.imageUrl}`;
        }

        const name = (product.productName || '').toLowerCase();

        // Anniversary Bouquets
        if (name.includes("crimson romance")) return A1;
        if (name.includes("pastel dream")) return A2;
        if (name.includes("velvet blush")) return A3;
        if (name.includes("golden grace")) return A4;
        if (name.includes("lily white")) return A5;
        if (name.includes("garden bloom")) return A6;

        // Anniversary Individual Flowers
        if (name.includes("rose stem") && name.includes("crimson")) return AI1;
        if (name.includes("lily stem") && name.includes("white")) return AI2;
        if (name.includes("peony stem") && name.includes("blush")) return AI3;
        if (name.includes("tulip stem") && name.includes("golden")) return AI4;
        if (name.includes("hydrangea stem") && name.includes("serene")) return AI5;
        if (name.includes("orchid splendor")) return AI6;
        if (name.includes("mystique iris")) return AI7;

        // Birthday Bouquets
        if (name.includes("rose stem") && name.includes("birthday")) return ABB1;
        if (name.includes("lily stem") && name.includes("birthday")) return ABB2;
        if (name.includes("peony stem") && name.includes("birthday")) return ABB3;
        if (name.includes("tulip stem") && name.includes("birthday")) return ABB4;
        if (name.includes("hydrangea stem") && name.includes("birthday")) return ABB5;
        if (name.includes("orchid splendor") && name.includes("birthday")) return ABB6;

        // Birthday Individual Flowers
        if (name.includes("yellow daisy")) return BI1;
        if (name.includes("pink grace rose")) return BI2;
        if (name.includes("purple magic")) return BI3;
        if (name.includes("blushing tulip")) return BI4;
        if (name.includes("white celebration")) return BI5;

        // Birthday Headdresses
        if (name.includes("queen crown")) return BH1;
        if (name.includes("petal tiara")) return BH2;
        if (name.includes("headband elegance")) return BH3;
        if (name.includes("dream wreath")) return BH4;
        if (name.includes("lily halo")) return BH5;

        // Convocation Bouquets
        if (name.includes("achievement bloom")) return C1;
        if (name.includes("golden glory")) return C2;
        if (name.includes("sapphire sparkle")) return C3;
        if (name.includes("crimson pride")) return C4;
        if (name.includes("violet dream")) return C5;
        if (name.includes("sunflower burst")) return C6;
        if (name.includes("lavender elegance")) return C7;
        if (name.includes("pastel harmony")) return C8;

        // Convocation Individual Flowers
        if (name.includes("scholar's crimson rose")) return CI1;
        if (name.includes("success golden lily")) return CI2;
        if (name.includes("academic orchid")) return CI3;
        if (name.includes("triumphant tulip")) return CI4;
        if (name.includes("graduation hydrangea")) return CI5;
        if (name.includes("honors lavender")) return CI6;
        if (name.includes("valedictorian iris")) return CI7;

        return '/images/placeholder.png';
    };

    // Auto-clear notification after 4 seconds
    useEffect(() => {
        if (successNotification) {
            const timer = setTimeout(() => {
                setSuccessNotification(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [successNotification]);

    // Map database product fields to the format expected by the card components
    const mapProduct = (p) => ({
        id: p.id,
        BoquetName: p.productName,
        FlowerName: p.productName,
        HeaddressName: p.productName,
        Price: `Rs ${Number(p.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        quantity: p.stockQuantity,
        image: getProductImage(p),
        categoryId: p.categoryId,
        subCategoryId: p.subCategoryId
    });

    const allMappedProducts = productsList.map(mapProduct);

    // Filter mapped products into separate category/subcategory lists
    const anniversaryBouquets = allMappedProducts.filter(p => p.categoryId === 1 && p.subCategoryId === 1);
    const birthdayBoquetFlowers = allMappedProducts.filter(p => p.categoryId === 1 && p.subCategoryId === 2);
    const convocationBouquets = allMappedProducts.filter(p => p.categoryId === 1 && p.subCategoryId === 3);

    const anniversaryIndividualFlowers = allMappedProducts.filter(p => p.categoryId === 3 && p.subCategoryId === 7);
    const birthdayIndividualFlowers = allMappedProducts.filter(p => p.categoryId === 3 && p.subCategoryId === 8);
    const convocationIndividualFlowers = allMappedProducts.filter(p => p.categoryId === 3 && p.subCategoryId === 9);

    const birthdayHeaddresses = allMappedProducts.filter(p => p.categoryId === 2 && p.subCategoryId === 5);

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

    const handleEdit = async (id, type, newPrice) => {
        try {
            const numericString = newPrice.replace(/Rs\s*/gi, '').replace(/,/g, '').trim();
            const numericPrice = parseFloat(numericString) || 0;

            // Fetch the existing product details first
            const getResponse = await api.get(`/api/products/${id}`);
            const existingProduct = getResponse.data;
            console.log(existingProduct);
            // Send PUT request to update only the price
            await api.put(`/api/products/${id}`, {
                ...existingProduct,
                price: numericPrice
            });

            // Update state dynamically
            setProductsList(prev => prev.map(p => p.id === id ? { ...p, price: numericPrice } : p));
            setSuccessNotification(`Price updated to ${newPrice} successfully.`);
        } catch (error) {
            console.error("Failed to update product price:", error);
            alert("Failed to update product price in backend.");
        }
    };

    const handleDelete = async (id, type) => {
        if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
            try {
                await api.delete(`/api/products/${id}`);
                // Update state dynamically
                setProductsList(prev => prev.filter(p => p.id !== id));
                setSuccessNotification(`${type} deleted successfully.`);
            } catch (error) {
                console.error("Failed to delete product:", error);
                alert("Failed to delete product in backend.");
            }
        }
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
                            {!isAddingProduct && (
                                <div className="flex items-start">
                                    <MAddProductButton onClick={() => setIsAddingProduct(true)} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Dashboard Content area */}
                    <div className="flex-1">
                        {isAddingProduct ? (
                            <MAddNewProductForm
                                onClose={() => setIsAddingProduct(false)}
                                onSubmit={() => {
                                    setIsAddingProduct(false);
                                    fetchProducts();
                                }}
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