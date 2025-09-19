'use client';

import { FiSearch, FiX, FiFilter } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export function FiltrosOfertas({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFilterChange,
  onClearFilters 
}) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchTerm);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearchChange]);

  const handleSearchChange = (e) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleClearFilters = () => {
    setLocalSearchTerm('');
    onClearFilters();
  };

  const hasActiveFilters = 
    filters.estado !== 'todos' || 
    filters.modalidad !== 'todos' || 
    filters.fecha !== 'recientes' ||
    localSearchTerm;

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Barra de búsqueda */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Buscar ofertas..."
            value={localSearchTerm}
            onChange={handleSearchChange}
          />
          {localSearchTerm && (
            <button
              onClick={() => setLocalSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Botón de filtros */}
        <div className="flex items-center space-x-2
        ">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              hasActiveFilters
                ? 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FiFilter className="h-4 w-4 mr-2" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-xs font-medium text-white">
                {[filters.estado, filters.modalidad, filters.fecha]
                  .filter(f => f !== 'todos' && f !== 'recientes').length + (localSearchTerm ? 1 : 0)}
              </span>
            )}
          </button>

          <Link
            href="/empresas/dashboard/ofertas/crear"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Nueva oferta
          </Link>
        </div>
      </div>

      {/* Panel de filtros desplegable */}
      {isFiltersOpen && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                value={filters.estado}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="todos">Todos los estados</option>
                <option value="publicada">Publicadas</option>
                <option value="cerrada">Cerradas</option>
                <option value="borrador">Borradores</option>
              </select>
            </div>

            <div>
              <label htmlFor="modalidad" className="block text-sm font-medium text-gray-700 mb-1">
                Modalidad
              </label>
              <select
                id="modalidad"
                name="modalidad"
                value={filters.modalidad}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="todos">Todas las modalidades</option>
                <option value="tiempo_completo">Tiempo completo</option>
                <option value="medio_tiempo">Medio tiempo</option>
                <option value="practica">Práctica</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <select
                id="fecha"
                name="fecha"
                value={filters.fecha}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="recientes">Más recientes primero</option>
                <option value="antiguas">Más antiguas primero</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiX className="mr-1 h-3 w-3" />
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
