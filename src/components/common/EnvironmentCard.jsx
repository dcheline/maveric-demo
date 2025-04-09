import React from 'react';

const EnvironmentCard = ({ image, name, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative p-4 rounded-lg border-2 cursor-pointer transition-all
        ${selected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-blue-300'
        }
      `}
    >
      <div className="aspect-w-16 aspect-h-9 mb-3">
        <img
          src={image}
          alt={name}
          className="object-cover rounded-md w-full h-full"
        />
      </div>
      <h3 className="text-lg font-medium text-center">{name}</h3>
      {selected && (
        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentCard; 