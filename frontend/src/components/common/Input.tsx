import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-white text-sm font-medium mb-1">
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          className={`
            w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg
            text-white placeholder-white/50
            focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
        
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;