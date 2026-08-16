import React from 'react';
import { Pause } from 'lucide-react';
import '../../css/employee.css';

// ---------------- STOP WORK BUTTON ----------------
export default function EStopButton({ onClick, disabled, label = 'Stop Work', style }) {
  console.log('[EStopButton] Props received:', { onClick, disabled, label, style });
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={style}
      className="btn-employee btn-employee-stop"
      title={label}
    >
      <Pause size={16} fill="currentColor" />
      <span>{label}</span>
    </button>
  );
}
