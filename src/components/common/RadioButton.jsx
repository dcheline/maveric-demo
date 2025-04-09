import React from 'react';

const RadioButton = ({ label, value, checked, onChange, name }) => {
  return (
    <label className="inline-flex items-center">
      <input
        type="radio"
        className="form-radio h-4 w-4 text-blue-600"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span className="ml-2">{label}</span>
    </label>
  );
};

export default RadioButton; 