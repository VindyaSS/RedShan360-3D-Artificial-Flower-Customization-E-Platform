import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBarM({ value = '', onChange, onClear, placeholder = 'search product', className = '' }) {
  return (
    <div className={`relative flex items-center w-full max-w-md ${className}`}>
      <span className="absolute left-4 text-[#744F51] opacity-70">
        <Search size={18} strokeWidth={2.5} />
      </span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-2.5 bg-white border border-[#e5e4e7] rounded-xl text-[#333] placeholder:text-[#666]/60 placeholder:font-medium text-sm font-sans focus:outline-none focus:border-[#744F51] focus:ring-2 focus:ring-[#744F51]/10 transition-all duration-200 shadow-sm"
      />
      {value && onClear && (
        <button
          onClick={onClear}
          type="button"
          className="absolute right-3 p-1 rounded-full text-[#666] hover:bg-[#744F51]/5 hover:text-[#744F51] transition-colors"
          title="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
