'use client';

import { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

export default function CategoryFilter({ 
  categories = [], 
  selectedCategory,
  onSelectCategory 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="relative">
      {/* Botón para móvil */}
      <div className="md:hidden mb-4">
        <button 
          onClick={toggleMobileMenu}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 w-full justify-between"
        >
          <span className="flex items-center">
            <FiFilter className="mr-2" />
            {selectedCategory === 'todas' ? 'Todas las categorías' : selectedCategory || 'Filtrar por categoría'}
          </span>
          {isMobileMenuOpen ? <FiX /> : <span>▼</span>}
        </button>
      </div>

      {/* Menú de categorías */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <FiFilter className="mr-2 text-indigo-600" />
            Categorías
          </h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => {
                  onSelectCategory('todas');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center transition-colors ${
                  selectedCategory === 'todas'
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                Todas las publicaciones
              </button>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => {
                    onSelectCategory(category.nombre);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center transition-colors ${
                    selectedCategory === category.nombre
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: category.color || '#6366F1' }}
                  ></span>
                  {category.nombre}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
