import React from 'react';
import { CheckCircle } from 'lucide-react';
import '../../css/employee.css';

export default function ECompletedButton({ onClick, disabled, label = 'Complete Work', style }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={style}
      className="btn-employee btn-employee-complete"
      title={label}
    >
      <CheckCircle size={16} />
      <span>{label}</span>
    </button>
  );
}
