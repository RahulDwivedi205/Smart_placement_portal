import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({
  className,
  type = 'text',
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  const inputClasses = cn(
    'w-full px-4 py-3 border rounded-xl transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
    'disabled:bg-gray-50 disabled:cursor-not-allowed backdrop-blur-sm',
    error 
      ? 'border-red-500 focus:ring-red-500' 
      : 'border-gray-300 hover:border-gray-400',
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{leftIcon}</span>
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{rightIcon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;