import React from 'react';
import { Edit3, Trash2, Box } from 'lucide-react';

export default function ConvocationBFlowerCard({
    image,
    quantity,
    BoquetName,
    Price,
    onEdit,
    onDelete
}) {
    // Check if item is low in stock (< 10) for custom badge colors
    const isLowStock = quantity <= 5;
    const isOutOfStock = quantity === 0;

    return (
        <div className="bg-[#faf8f6] rounded-2xl border border-[#e5e4e7] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group h-full">
            {/* Image Container displaying full image without crop */}
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

            {/* Card Content */}
            <div className="p-4 flex flex-col flex-1 gap-3 justify-between">
                <div>
                    <span className="text-[11px] font-semibold text-[#744F51]/75 uppercase tracking-widest font-sans">
                        Convocation Bouquet
                    </span>
                    <h3 className="text-base font-bold text-[#1a1a1a] mt-1 line-clamp-2 font-sans">
                        {BoquetName}
                    </h3>
                </div>

                {/* Price, Quantity and Actions Row */}
                <div className="pt-3 border-t border-[#e5e4e7]/60 flex flex-col gap-3">
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

                    {/* Actions under the Price */}
                    <div className="flex items-center gap-2">
                        {onEdit && (
                            <button
                                onClick={onEdit}
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
                </div>
            </div>
        </div>
    );
}
