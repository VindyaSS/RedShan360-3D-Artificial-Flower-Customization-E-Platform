import React from "react";

export default function MCards() {
  return (
    <div className="overflow-hidden text-center bg-white rounded shadow-md text-slate-500 shadow-slate-200">
      
      {/* Icon */}
      <figure className="pt-4 pb-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 mx-auto text-[#333]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1"
          role="graphics-symbol"
          aria-labelledby="title-01 desc-01"
        >
          <title id="title-01">Total Orders</title>
          <desc id="desc-01">50</desc>

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
        </svg>
      </figure>

      {/* Content */}
      <div className="px-6 pb-4 pt-1">
        <h3 className="mb-1 text-xl font-medium text-[#333]">
          Total Orders
        </h3>

        <p className="text-lg font-semibold text-[#333]">
          50
        </p>
      </div>
    </div>
  );
}