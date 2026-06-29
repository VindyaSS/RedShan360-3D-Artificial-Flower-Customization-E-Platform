import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = forwardRef(({ 
  id,
  placeholder = '••••••••',
  value,
  onChange,
  className = '',
  name,
  style = {},
  required = false,
  disabled = false,
  ...rest
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full flex items-center">
      <input
        ref={ref}
        id={id}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        disabled={disabled}
        className={`${className}`}
        style={{ ...style, width: '100%', boxSizing: 'border-box', paddingRight: '40px' }}
        {...rest}
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        disabled={disabled}
        tabIndex={0}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#744F51] disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center p-1 hover:scale-105"
        style={{ background: 'none', border: 'none', outline: 'none', zIndex: 5 }}
      >
        {showPassword ? (
          <Eye size={18} className="stroke-[2px]" />
        ) : (
          <EyeOff size={18} className="stroke-[2px]" />
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
