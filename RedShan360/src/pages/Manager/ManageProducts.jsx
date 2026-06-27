import React, { useState } from 'react';
import '../../css/manager.css';
import SideNavigation from '../../components/managerComponent/sideNavigation';
import SearchBarM from '../../components/managerComponent/searchBarM';
import SubNavbarM from '../../components/managerComponent/subNavbarM';
import AniversaryBFlowerCard from '../../components/managerComponent/AniversaryBFlowerCard';
import AnniversaryIFlowerCard from '../../components/managerComponent/AnniversaryIFlowerCard';
import BirthdayBFlowerCard from '../../components/managerComponent/BirthdayBFlowerCard';

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

export default function MmanageProducts() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSector, setActiveSector] = useState('All');

    // Anniversary Bouquets Mock Data
    const anniversaryBouquets = [
        { id: 1, BoquetName: "Luxury Crimson Romance", Price: "Rs 5,500.00", quantity: 12, image: A1 },
        { id: 2, BoquetName: "Ethereal Pastel Dream", Price: "Rs 6,200.00", quantity: 8, image: A2 },
        { id: 3, BoquetName: "Royal Velvet Blush", Price: "Rs 7,000.00", quantity: 3, image: A3 },
        { id: 4, BoquetName: "Classic Golden Grace", Price: "Rs 6,500.00", quantity: 15, image: A4 },
        { id: 5, BoquetName: "Whispering Lily White", Price: "Rs 4,800.00", quantity: 0, image: A5 },
        { id: 6, BoquetName: "Enchanted Garden Bloom", Price: "Rs 8,500.00", quantity: 6, image: A6 }
    ];

    // Anniversary Individual Flowers Mock Data
    const anniversaryIndividualFlowers = [
        { id: 1, FlowerName: "Crimson Silk Rose Stem", Price: "Rs 1,200.00", quantity: 24, image: AI1 },
        { id: 2, FlowerName: "Ethereal White Lily Stem", Price: "Rs 1,500.00", quantity: 18, image: AI2 },
        { id: 3, FlowerName: "Velvet Blush Peony Stem", Price: "Rs 1,800.00", quantity: 9, image: AI3 },
        { id: 4, FlowerName: "Golden Grace Tulip Stem", Price: "Rs 1,350.00", quantity: 30, image: AI4 },
        { id: 5, FlowerName: "Serene Hydrangea Stem", Price: "Rs 2,100.00", quantity: 4, image: AI5 },
        { id: 6, FlowerName: "Orchid Splendor Stem", Price: "Rs 2,400.00", quantity: 15, image: AI6 },
        { id: 7, FlowerName: "Mystique Iris Stem", Price: "Rs 1,650.00", quantity: 0, image: AI7 }
    ];
    // Birthday FlowerBoquets Mock Data
    const birthdayBoquetFlowers = [
        { id: 1, FlowerName: "Crimson Silk Rose Stem", Price: "Rs 1,200.00", quantity: 24, image: ABB1 },
        { id: 2, FlowerName: "Ethereal White Lily Stem", Price: "Rs 1,500.00", quantity: 18, image: ABB2 },
        { id: 3, FlowerName: "Velvet Blush Peony Stem", Price: "Rs 1,800.00", quantity: 9, image: ABB3 },
        { id: 4, FlowerName: "Golden Grace Tulip Stem", Price: "Rs 1,350.00", quantity: 30, image: ABB4 },
        { id: 5, FlowerName: "Serene Hydrangea Stem", Price: "Rs 2,100.00", quantity: 4, image: ABB5 },
        { id: 6, FlowerName: "Orchid Splendor Stem", Price: "Rs 2,400.00", quantity: 15, image: ABB6 }
    ];

    // Filter bouquets based on search query
    const filteredBouquets = anniversaryBouquets.filter(bouquet =>
        bouquet.BoquetName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter individual flowers based on search query
    const filteredIndividualFlowers = anniversaryIndividualFlowers.filter(flower =>
        flower.FlowerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter birthday bouquets based on search query
    const filteredBirthdayBouquets = birthdayBoquetFlowers.filter(bouquet =>
        (bouquet.FlowerName || bouquet.BoquetName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (id, type) => {
        alert(`Edit ${type} with ID: ${id}`);
    };

    const handleDelete = (id, type) => {
        alert(`Delete ${type} with ID: ${id}`);
    };

    return (
        <>
            <div className="MPage">
                <div className="Mpart1">
                    <SideNavigation />
                </div>
                <div className="Mpart2" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Top Bar with Search and SubNavbar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e4e7] pb-6">
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

                    {/* Dashboard Content area */}
                    <div className="flex-1">
                        {activeSector === 'Anniversary - Boquets' ? (
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
                                                onEdit={() => handleEdit(bouquet.id, 'Bouquet')}
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
                                                onEdit={() => handleEdit(flower.id, 'Individual Flower')}
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
                                                onEdit={() => handleEdit(bouquet.id, 'Birthday Bouquet')}
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
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-[#e5e4e7] rounded-2xl shadow-sm gap-3">
                                <h3 className="text-base font-semibold text-[#1a1a1a]">Select a Subsector from the Navbar</h3>
                                <p className="text-sm text-[#666] max-w-sm">
                                    Please open a dropdown list in the sub-navbar and click a category (like Anniversary &rarr; Boquets, Anniversary &rarr; Individual Flowers, or Birthday &rarr; Boquets) to view cards.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}