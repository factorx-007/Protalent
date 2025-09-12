import React from 'react';

export default function ImageCard({ image, title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-xl">
      <img src={image} alt={title} className="h-48 w-full object-cover rounded-lg mb-4" />
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
} 