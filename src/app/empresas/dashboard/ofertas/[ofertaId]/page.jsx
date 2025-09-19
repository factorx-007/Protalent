'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@context/auth/AuthContext';
import { 
  FiArrowLeft, 
  FiEdit, 
  FiUsers, 
  FiCalendar, 
  FiMapPin, 
  FiClock, 
  FiBriefcase,
  FiTrendingUp,
  FiEye,
  FiTarget,
  FiAward,
  FiAlertCircle
} from 'react-icons/fi';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import api from '@lib/axios';

export default function OfertaDetallesPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { ofertaId } = params;

  const [oferta, setOferta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);

  // Verificar autenticación y permisos
  useEffect(() => {
    if (authLoading) return;
    
    if (!user || user.rol?.toUpperCase() !== 'EMPRESA') {
      router.push('/auth/login');
      return;
    }
  }, [user, authLoading, router]);

  // Cargar datos de la oferta
  useEffect(() => {
    if (!user || !ofertaId) return;

    const fetchOfertaData = async () => {
      try {
        setLoading(true);
        
        // Cargar datos de la oferta con relaciones
        const [ofertaResponse, analyticsResponse] = await Promise.all([
          api.get(`/api/ofertas/${ofertaId}/detalle`),
          api.get(`/api/ofertas/${ofertaId}/analytics`)
        ]);

        console.log('🔍 [OfertaDetalle] Respuesta oferta:', ofertaResponse.data);
        console.log('🔍 [OfertaDetalle] Respuesta analytics:', analyticsResponse.data);
        
        setOferta(ofertaResponse.data.data || ofertaResponse.data);
        setAnalytics(analyticsResponse.data.data || analyticsResponse.data);

        // Simular insights de IA (preparado para implementación futura)
        setAiInsights({
          performanceScore: 78,
          recommendations: [
            'Considera agregar más detalles sobre beneficios',
            'El título podría ser más específico',
            'Agrega requisitos de experiencia claros'
          ],
          trendingKeywords: ['React', 'Node.js', 'Remote'],
          competitiveAnalysis: {
            avgSalary: 3500,
            positionRanking: 'Top 25%',
            timeToFill: '14 días promedio'
          }
        });

      } catch (error) {
        console.error('Error al cargar datos de la oferta:', error);
        toast.error('Error al cargar los detalles de la oferta');
        router.push('/empresas/dashboard/ofertas');
      } finally {
        setLoading(false);
      }
    };

    fetchOfertaData();
  }, [user, ofertaId, router]);

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Estado de carga
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!oferta) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Oferta no encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">
            La oferta que buscas no existe o no tienes permisos para verla.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="h-5 w-5 mr-2" />
              Volver
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{oferta.titulo}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <p className="text-gray-600">Análisis detallado de la oferta</p>
                {oferta.empresa && (
                  <span className="text-sm text-gray-500">
                    • {oferta.empresa.nombre_empresa}
                  </span>
                )}
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  oferta.estado === 'publicada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {oferta.estado === 'publicada' ? 'Publicada' : 'Cerrada'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/empresas/dashboard/ofertas/${ofertaId}/postulaciones`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiUsers className="h-4 w-4 mr-2" />
              Ver Postulaciones
            </Link>
            <Link
              href={`/empresas/dashboard/ofertas/editar/${ofertaId}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              <FiEdit className="h-4 w-4 mr-2" />
              Editar Oferta
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal - Detalles de la oferta */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información básica */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles de la Oferta</h2>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="flex items-center">
                <FiCalendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Fecha de publicación</p>
                  <p className="font-medium">{formatDate(oferta.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiClock className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Duración</p>
                  <p className="font-medium">{oferta.duracion || 'No especificada'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiMapPin className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="font-medium">{oferta.ubicacion || 'No especificada'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiBriefcase className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Modalidad</p>
                  <p className="font-medium">
                    {oferta.modalidad === 'tiempo_completo' ? 'Tiempo completo' : 
                     oferta.modalidad === 'medio_tiempo' ? 'Medio tiempo' : 
                     oferta.modalidad === 'practica' ? 'Práctica' : 
                     oferta.modalidad === 'freelance' ? 'Freelance' :
                     oferta.modalidad === 'remoto' ? 'Remoto' :
                     oferta.modalidad === 'hibrido' ? 'Híbrido' : 'No especificada'}
                  </p>
                </div>
              </div>
              
              {oferta.salario && (
                <div className="flex items-center">
                  <FiTrendingUp className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Salario</p>
                    <p className="font-medium">{oferta.salario}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center">
                <FiUsers className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Postulaciones</p>
                  <p className="font-medium">{oferta.postulaciones?.length || 0} candidatos</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Descripción</h3>
              <div className="prose max-w-none text-gray-700">
                {oferta.descripcion ? (
                  <p className="whitespace-pre-wrap">{oferta.descripcion}</p>
                ) : (
                  <p className="text-gray-500 italic">No hay descripción disponible</p>
                )}
              </div>
            </div>
          </div>

          {/* Requisitos */}
          {oferta.requisitos && oferta.requisitos.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Requisitos</h3>
              <div className="space-y-3">
                {oferta.requisitos.map((requisito, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{requisito.requisito}</p>
                      {requisito.descripcion && (
                        <p className="text-sm text-gray-600 mt-1">{requisito.descripcion}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preguntas personalizadas */}
          {oferta.preguntas && oferta.preguntas.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preguntas para Candidatos</h3>
              <div className="space-y-4">
                {oferta.preguntas.map((pregunta, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <p className="font-medium text-gray-900">{pregunta.pregunta}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Tipo: {pregunta.tipo} {pregunta.requerida && '• Requerida'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Analytics e Insights */}
        <div className="space-y-6">
          {/* Métricas de rendimiento */}
          {analytics && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Métricas de Rendimiento</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiEye className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Visualizaciones</span>
                  </div>
                  <span className="font-semibold">{analytics.views || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiUsers className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Postulaciones</span>
                  </div>
                  <span className="font-semibold">{analytics.applications || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiTrendingUp className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Tasa de conversión</span>
                  </div>
                  <span className="font-semibold">{analytics.conversionRate || 0}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Insights de IA (preparado para implementación futura) */}
          {aiInsights && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
              <div className="flex items-center mb-4">
                <FiTarget className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-medium text-purple-900">Análisis IA</h3>
                <span className="ml-2 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                  Beta
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-purple-700">Score de Performance</span>
                    <span className="font-bold text-purple-900">{aiInsights.performanceScore}/100</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${aiInsights.performanceScore}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-purple-900 mb-2">Recomendaciones</h4>
                  <ul className="space-y-1">
                    {aiInsights.recommendations.map((rec, index) => (
                      <li key={index} className="text-xs text-purple-700 flex items-start">
                        <span className="mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-purple-200">
                  <p className="text-xs text-purple-600">
                    🚀 Próximamente: Análisis más profundo con IA
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Acciones rápidas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
            
            <div className="space-y-3">
              <Link
                href={`/empresas/dashboard/ofertas/${ofertaId}/postulaciones`}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiUsers className="h-4 w-4 mr-2" />
                Gestionar Postulaciones
              </Link>
              
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <FiTrendingUp className="h-4 w-4 mr-2" />
                Generar Reporte
              </button>
              
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <FiAward className="h-4 w-4 mr-2" />
                Promover Oferta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}