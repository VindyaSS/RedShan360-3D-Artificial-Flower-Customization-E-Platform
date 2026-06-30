import React from 'react';
import { Plus } from 'lucide-react';

export default function MAddProductButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#744F51] hover:bg-[#5e3f41] text-white font-bold text-sm rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg focus:outline-none"
        >
            <Plus size={16} />
            <span>Add New Product</span>
        </button>
    );
}
