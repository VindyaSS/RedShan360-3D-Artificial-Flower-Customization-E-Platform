import React from "react";

export default function MOrderCard({ icon, title, value  }) {
  return (
    <div className="overflow-hidden text-center bg-white rounded shadow-md text-slate-500 shadow-slate-200">
      
      {/* Icon */}
      <figure className="pt-4 pb-1">
        {icon}
      </figure>

      {/* Content */}
      <div className="px-6 pb-4 pt-1">
        <h3 className="mb-1 text-xl font-medium text-[#333]">
          {title}
        </h3>

        <p className="text-lg font-semibold text-[#333]">
          {value}
        </p>
      </div>
    </div>
  );
}