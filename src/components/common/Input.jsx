import React from 'react';

const Input = ({ 
  type = 'text',
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        `}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input; 