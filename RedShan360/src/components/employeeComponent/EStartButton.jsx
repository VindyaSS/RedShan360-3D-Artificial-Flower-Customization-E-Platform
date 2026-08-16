import React from 'react';
import { Play } from 'lucide-react';
import '../../css/employee.css';

// ---------------- START WORK BUTTON ----------------
export default function EStartButton({ onClick, disabled, label = 'Start Work', style }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={style}
      className="btn-employee btn-employee-start"
      title={label}
    >
      <Play size={16} fill="currentColor" />
      <span>{label}</span>
    </button>
  );
}
