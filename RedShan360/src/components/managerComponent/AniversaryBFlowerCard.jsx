import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, Box } from 'lucide-react';

export default function AniversaryBFlowerCard({
    image,
    quantity,
    BoquetName,
    Price,
    onEdit,
    onDelete
}) {
    console.log('[AniversaryBFlowerCard] Props received:', { image, quantity, BoquetName, Price, onEdit, onDelete });
    const [isEditing, setIsEditing] = useState(false);
    const [newPrice, setNewPrice] = useState(Price);

    // Sync price input when prop changes
    useEffect(() => {
        setNewPrice(Price);
    }, [Price]);

    // ---------------- Handle Price Change ----------------
    const handleChangePrice = () => {
    if (!newPrice.trim()) return;

    const numericString = newPrice
        .replace(/Rs\s*/gi, '')
        .replace(/,/g, '')
        .trim();

    if (!isNaN(numericString) && numericString !== '') {

        const num = parseFloat(numericString);

        if (window.confirm("Are you sure you want to change the price?")) {

            if (onEdit) {
                // Send NUMBER to backend
                onEdit(num);
            }

            setIsEditing(false);
        }
    }
};

    // Stock level flags for badge color
    const isLowStock = quantity <= 5;
    const isOutOfStock = quantity === 0;

    return (
        <div className="bg-[#faf8f6] rounded-2xl border border-[#e5e4e7] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group h-full">

            {/* ---------------- Product Image ---------------- */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f4f0ed] border-b border-[#e5e4e7] flex items-center justify-center">
                {image ? (
                    <img
                        src={image}
                        alt={BoquetName}
                        className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#744F51] bg-[#744F51]/5 gap-2">
                        <Box size={32} strokeWidth={1.5} />
                        <span className="text-xs font-semibold uppercase tracking-wider opacity-60">No Image Available</span>
                    </div>
                )}
            </div>

            {/* ---------------- Card Content ---------------- */}
            <div className="p-4 flex flex-col flex-1 gap-3 justify-between">
                <div>
                    <span className="text-[11px] font-semibold text-[#744F51]/75 uppercase tracking-widest font-sans">
                        Anniversary Bouquet
                    </span>
                    <h3 className="text-base font-bold text-[#1a1a1a] mt-1 line-clamp-2 font-sans">
                        {BoquetName}
                    </h3>
                </div>

                {/* ---------------- Price & Actions ---------------- */}
                <div className="pt-3 border-t border-[#e5e4e7]/60 flex flex-col gap-3">
                    {isEditing ? (
                        <div className="flex flex-col gap-2">
                            <div>
                                <span className="text-[10px] text-[#666] uppercase tracking-wider block font-semibold">Current Price</span>
                                <span className="text-sm font-bold text-gray-500 line-through font-sans">
                                    {Price}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] text-[#666] uppercase tracking-wider block font-semibold">New Price</span>
                                <input
                                    type="text"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#e5e4e7] rounded-lg focus:outline-none focus:border-[#744F51] font-sans font-bold text-[#744F51]"
                                />
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <button
                                    onClick={handleChangePrice}
                                    className="flex-1 py-2 px-3 bg-[#744F51] hover:bg-[#5c3e40] text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                    Change
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setNewPrice(Price);
                                    }}
                                    className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] text-[#666] uppercase tracking-wider block font-semibold">Price</span>
                                    <span className="text-base font-bold text-[#744F51] font-sans">
                                        {Price}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-[#666] uppercase tracking-wider block font-semibold">Quantity</span>
                                    <span className={`text-sm font-bold font-sans ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-[#1a1a1a]'}`}>
                                        {quantity}
                                    </span>
                                </div>
                            </div>

                            {/* ---------------- Action Buttons ---------------- */}
                            <div className="flex items-center gap-2">
                                {onEdit && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 py-2 px-3 bg-[#744F51]/5 hover:bg-[#744F51] text-[#744F51] hover:text-white text-xs font-bold rounded-lg border border-[#744F51]/10 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                        title="Edit Bouquet"
                                    >
                                        <Edit3 size={14} />
                                        <span>Edit</span>
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={onDelete}
                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-[#e5e4e7] transition-all"
                                        title="Delete Bouquet"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
