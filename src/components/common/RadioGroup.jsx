import React from 'react';

const RadioGroup = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={className}>
      <label
        className={`
          block text-sm font-medium mb-2
          ${error ? 'text-red-500' : 'text-gray-700'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              required={required}
              disabled={disabled}
              className={`
                h-4 w-4 border-gray-300 text-blue-600
                focus:ring-blue-500 focus:ring-offset-0
                ${error ? 'border-red-500' : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className={`
                ml-3 text-sm
                ${error ? 'text-red-500' : 'text-gray-700'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default RadioGroup; 