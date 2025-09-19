'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@context/auth/AuthContext';
import { useOfertas } from '@components/empresas/ofertas/hooks/useOfertas';
import { OfertasTable } from '@components/empresas/ofertas/components/OfertasTable';
import { FiltrosOfertas } from '@components/empresas/ofertas/components/FiltrosOfertas';
import { FiBriefcase } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Head from 'next/head';

export default function OfertasPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  console.log('🔑 [OfertasPage] Usuario actual:', {
    id: user?.id,
    rol: user?.rol,
    tieneEmpresa: !!user?.empresa,
    empresaId: user?.empresa?.id || user?.empresaId
  });
  
  const {
    ofertas,
    loading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    pagination,
    handlePageChange,
    handleDeleteOferta,
    toggleOfertaEstado,
    refreshOfertas
  } = useOfertas(user, authLoading);

  // Redirigir si el usuario no está autenticado o no es una empresa
  useEffect(() => {
    console.log('🔄 [OfertasPage] Efecto de redirección ejecutándose');
    
    // No hacer nada mientras está cargando la autenticación
    if (authLoading) {
      console.log('⏳ [OfertasPage] AuthContext aún cargando, esperando...');
      return;
    }
    
    if (!user) {
      console.log('🔴 [OfertasPage] No hay usuario, redirigiendo a login');
      router.push('/auth/login');
      return;
    }
    
    if (user.rol?.toUpperCase() !== 'EMPRESA') {
      console.log(`🔴 [OfertasPage] Usuario no es una empresa (rol: ${user.rol}), redirigiendo a dashboard`);
      router.push('/dashboard');
      toast.error('No tienes permiso para acceder a esta sección');
    } else {
      console.log('🟢 [OfertasPage] Usuario válido, cargando ofertas...');
    }
  }, [user, router, authLoading]);

  // Manejar cambios en los filtros
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Limpiar todos los filtros
  const handleClearFilters = () => {
    setFilters({
      estado: 'todos',
      modalidad: 'todos',
      fecha: 'recientes',
    });
  };

  // No necesitamos el efecto de carga aquí ya que lo manejamos en el hook useOfertas

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Obtener número de postulaciones
  const getPostulacionesCount = (oferta) => {
    return oferta.Postulaciones?.length || 0;
  };

  // Si está cargando la autenticación o el usuario no está disponible, mostrar carga
  if (authLoading || !user || user.rol?.toUpperCase() !== 'EMPRESA') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Mis Ofertas - Panel de Empresa | ProTalent</title>
        <meta name="description" content="Gestiona tus ofertas de trabajo publicadas en ProTalent" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado */}
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Mis Ofertas de Trabajo
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Gestiona y publica ofertas de trabajo en tu empresa.
              </p>
            </div>
          </div>

          {/* Filtros y búsqueda */}
          <FiltrosOfertas 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {/* Tabla de ofertas */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <OfertasTable 
              ofertas={ofertas}
              loading={loading}
              onDelete={handleDeleteOferta}
              onToggleEstado={toggleOfertaEstado}
              empresaId={user?.empresa?.id || user?.empresaId}
            />
          </div>

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    pagination.page === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    pagination.page === pagination.totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{ofertas.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}</span> a{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    de <span className="font-medium">{pagination.total}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        pagination.page === 1 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Anterior</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      // Calcular el rango de páginas a mostrar
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pagination.page === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        pagination.page === pagination.totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Siguiente</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

