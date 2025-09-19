'use client';

import { FiEdit2, FiTrash2, FiEye, FiUsers, FiToggleLeft, FiToggleRight, FiBriefcase, FiTrendingUp } from 'react-icons/fi';
import { format, isValid, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

// Helper function to safely format dates
const formatDate = (dateString) => {
  if (!dateString) return 'No especificada';
  
  const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
  
  if (!isValid(date)) {
    console.warn('Fecha inválida:', dateString);
    return 'Fecha inválida';
  }
  
  return format(date, 'd MMM yyyy', { locale: es });
};

export function OfertasTable({ 
  ofertas, 
  loading, 
  onDelete, 
  onToggleEstado,
  empresaId 
}) {
  console.log('📊 [OfertasTable] Renderizando con:', {
    loading,
    ofertasCount: ofertas?.length,
    empresaId
  });
  
  console.log('📋 [OfertasTable] Datos de ofertas:', ofertas?.map(o => ({
    id: o.id,
    titulo: o.titulo,
    estado: o.estado,
    modalidad: o.modalidad,
    ubicacion: o.ubicacion,
    salario: o.salario,
    duracion: o.duracion,
    fechaPublicacion: o.fechaPublicacion || o.createdAt,
    postulaciones: o.postulaciones || o.Postulaciones?.length || 0
  })));
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (ofertas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FiBriefcase className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-gray-500 text-lg font-medium">No hay ofertas publicadas</h3>
        <p className="text-gray-400 mt-1">Crea tu primera oferta para comenzar</p>
      </div>
    );
  }

  const getEstadoStyles = (estado) => {
    const styles = {
      publicada: 'bg-green-100 text-green-800',
      cerrada: 'bg-red-100 text-red-800',
      borrador: 'bg-yellow-100 text-yellow-800',
    };
    return styles[estado] || 'bg-gray-100 text-gray-800';
  };

  const getModalidadStyles = (modalidad) => {
    const styles = {
      'tiempo_completo': 'bg-blue-50 text-blue-700',
      'medio_tiempo': 'bg-purple-50 text-purple-700',
      'practica': 'bg-amber-50 text-amber-700',
      'freelance': 'bg-emerald-50 text-emerald-700',
    };
    return styles[modalidad] || 'bg-gray-50 text-gray-700';
  };

  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Puesto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modalidad
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Postulaciones
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Publicada
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ofertas.map((oferta) => (
              <tr key={oferta.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                      <FiBriefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{oferta.titulo}</div>
                      <div className="text-sm text-gray-500">{oferta.ubicacion}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getModalidadStyles(oferta.modalidad)}`}>
                    {oferta.modalidad === 'tiempo_completo' ? 'Tiempo completo' : 
                     oferta.modalidad === 'medio_tiempo' ? 'Medio tiempo' : 
                     oferta.modalidad === 'practica' ? 'Práctica' : 'Freelance'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiUsers className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-900">{oferta.postulaciones || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoStyles(oferta.estado)}`}>
                    {oferta.estado === 'publicada' ? 'Publicada' : 
                     oferta.estado === 'cerrada' ? 'Cerrada' : 'Borrador'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(oferta.fechaPublicacion)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link 
                      href={`/empresas/dashboard/ofertas/${oferta.id}`}
                      className="text-purple-600 hover:text-purple-900"
                      title="Análisis detallado"
                    >
                      <FiTrendingUp className="h-5 w-5" />
                    </Link>
                    <Link 
                      href={`/empresas/dashboard/ofertas/${oferta.id}/postulaciones`}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver postulaciones"
                    >
                      <FiUsers className="h-5 w-5" />
                    </Link>
                    <Link 
                      href={`/empresas/dashboard/ofertas/editar/${oferta.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Editar"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => onToggleEstado(oferta.id, oferta.estado)}
                      className={`${oferta.estado === 'publicada' ? 'text-green-600 hover:text-green-900' : 'text-gray-400 hover:text-gray-600'}`}
                      title={oferta.estado === 'publicada' ? 'Despublicar oferta' : 'Publicar oferta'}
                    >
                      {oferta.estado === 'publicada' ? 
                        <FiToggleRight className="h-5 w-5" /> : 
                        <FiToggleLeft className="h-5 w-5" />
                      }
                    </button>
                    <button
                      onClick={() => onDelete(oferta.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
