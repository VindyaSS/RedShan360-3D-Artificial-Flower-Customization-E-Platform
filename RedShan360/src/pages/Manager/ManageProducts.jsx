import React, { useState, useEffect } from 'react';
import '../../css/manager.css';
import SideNavigation from '../../components/managerComponent/sideNavigation';
import SearchBarM from '../../components/managerComponent/searchBarM';
import SubNavbarM from '../../components/managerComponent/subNavbarM';
import MAddNewProductForm from '../../components/managerComponent/MAddNewProductForm';
import MAddProductButton from '../../components/managerComponent/MAddProductButton';
import { X } from 'lucide-react';
import AniversaryBFlowerCard from '../../components/managerComponent/AniversaryBFlowerCard';
import AnniversaryIFlowerCard from '../../components/managerComponent/AnniversaryIFlowerCard';
import BirthdayBFlowerCard from '../../components/managerComponent/BirthdayBFlowerCard';
import BirthdayIFlowerCard from '../../components/managerComponent/BirthdayIFlowerCard';
import BirthdayHeaddressCard from '../../components/managerComponent/BirthdayHeaddressCard';
import ConvocationBFlowerCard from '../../components/managerComponent/ConvocationBFlowerCard';
import ConvocationIFlowerCard from '../../components/managerComponent/ConvocationIFlowerCard';
import api from '../../services/api';

const API_BASE_URL = "http://localhost:8080/api";

// ---------------- MANAGE PRODUCTS PAGE ----------------
export default function MmanageProducts() {

    // ---------------- STATE ----------------
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSector, setActiveSector] = useState('All');
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [successNotification, setSuccessNotification] = useState(null);
    const [productsList, setProductsList] = useState([]);

    // ---------------- FETCH PRODUCTS ----------------
    const fetchProducts = async () => {
        try {
            const response = await api.get('/api/products');
            console.log('[ManageProducts] fetchProducts - Status:', response.status, '| Data:', response.data);
            setProductsList(response.data);
        } catch (error) {
            // Failed to load products
        }
    };

    // ---------------- INITIAL LOAD ----------------
    useEffect(() => {
        fetchProducts();
    }, []);

    // ---------------- AUTO-CLEAR NOTIFICATION ----------------
    // Automatically dismiss the success toast after 4 seconds
    useEffect(() => {
        if (successNotification) {
            const timer = setTimeout(() => {
                setSuccessNotification(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [successNotification]);

    // ---------------- IMAGE RESOLVER ----------------
    // Returns backend image URL or placeholder if not available
    const getProductImage = (product) => {
        if (product.imageUrl) {
            return product.imageUrl;
        }
        return '/images/placeholder.png';
    };

    // ---------------- MAP PRODUCT TO CARD FORMAT ----------------
    // Maps database product fields to the format expected by card components
    const mapProduct = (p) => ({
        id: p.productId,
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

    // ---------------- FILTER BY CATEGORY AND SUBCATEGORY ----------------
    const anniversaryBouquets = allMappedProducts.filter(p => p.categoryId === 1 && p.subCategoryId === 1);
    const birthdayBoquetFlowers = allMappedProducts.filter(p => p.categoryId === 1 && p.subCategoryId === 2);
    const convocationBouquets = allMappedProducts.filter(p => p.categoryId === 1 && p.subCategoryId === 3);

    const anniversaryIndividualFlowers = allMappedProducts.filter(p => p.categoryId === 3 && p.subCategoryId === 7);
    const birthdayIndividualFlowers = allMappedProducts.filter(p => p.categoryId === 3 && p.subCategoryId === 8);
    const convocationIndividualFlowers = allMappedProducts.filter(p => p.categoryId === 3 && p.subCategoryId === 9);

    const birthdayHeaddresses = allMappedProducts.filter(p => p.categoryId === 2 && p.subCategoryId === 5);

    // ---------------- FILTER BY SEARCH QUERY ----------------
    const filteredBouquets = anniversaryBouquets.filter(bouquet =>
        (bouquet.BoquetName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredIndividualFlowers = anniversaryIndividualFlowers.filter(flower =>
        (flower.FlowerName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredBirthdayBouquets = birthdayBoquetFlowers.filter(bouquet =>
        (bouquet.FlowerName || bouquet.BoquetName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredBirthdayIndividualFlowers = birthdayIndividualFlowers.filter(flower =>
        (flower.FlowerName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredBirthdayHeaddresses = birthdayHeaddresses.filter(headdress =>
        (headdress.HeaddressName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredConvocationBouquets = convocationBouquets.filter(bouquet =>
        (bouquet.BoquetName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredConvocationIndividualFlowers = convocationIndividualFlowers.filter(flower =>
        (flower.FlowerName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ---------------- EDIT PRODUCT PRICE ----------------
    
const handleEdit = async (productId, type, newPrice) => {
    await updateProductPrice(productId, newPrice);
};

const updateProductPrice = async (productId, newPrice) => {
    try {

        console.log("Product ID:", productId);
        console.log("New Price:", newPrice);
        console.log("Price type:", typeof newPrice);

        await api.put(
            `/api/products/${productId}/price`,
            {
                price: newPrice
            }
        );

        await fetchProducts();

        alert("Price updated successfully!");

    } catch (error) {

        console.error("Error updating price:", error);
        console.error("Backend response:", error.response?.data);

        alert("Failed to update price");
    }
};

    // ---------------- DELETE PRODUCT ----------------
    const handleDelete = async (id, type) => {
        if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
            try {
                await api.delete(`/api/products/${id}`);
                // Remove deleted product from local list
                setProductsList(prev => prev.filter(p => p.id !== id));
                setSuccessNotification(`${type} deleted successfully.`);
            } catch (error) {
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