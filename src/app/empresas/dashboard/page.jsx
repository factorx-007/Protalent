'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/auth/AuthContext';
import { empresaDashboardApi } from '../../lib/empresaApi';
import { useOfertas } from '@components/empresas/ofertas/hooks/useOfertas';
import { FiBriefcase, FiUsers, FiClock, FiTrendingUp, FiCheckCircle, FiDollarSign, FiMapPin, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Bar, Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Helper function to safely format dates
const formatDate = (dateString) => {
  if (!dateString) return 'No especificada';
  try {
    const date = new Date(dateString);
    return format(date, 'd MMM yyyy', { locale: es });
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'Fecha inválida';
  }
};

export default function EmpresasDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para datos del dashboard
  const [stats, setStats] = useState({
    totalOfertas: 0,
    ofertasActivas: 0,
    postulacionesTotales: 0,
    postulacionesNuevas: 0,
    tasaContratacion: 0,
    tiempoPromedioContratacion: 0,
  });

  // Obtener ofertas recientes
  const {
    ofertas,
    loading: ofertasLoading,
    handleDeleteOferta,
    toggleOfertaEstado,
    refreshOfertas
  } = useOfertas(user);
  
  // Estados adicionales para gráficos y listados
  const [postulacionesData, setPostulacionesData] = useState({
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
    datasets: [
      {
        label: 'Postulaciones',
        data: [],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        tension: 0.3,
        fill: true,
      },
    ],
  });
  
  const [ofertasRecientes, setOfertasRecientes] = useState([]);
  const [actividadReciente, setActividadReciente] = useState([]);
  
  const [postulacionesPorCargo, setPostulacionesPorCargo] = useState({
    labels: [],
    datasets: [
      {
        label: 'Postulaciones por cargo',
        data: [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  const loadSampleData = async () => {
    try {
      const { 
        dashboardStats, 
        postulacionesPorMes, 
        ofertasRecientes, 
        actividadReciente 
      } = await import('@/app/data/empresa/dashboardData');
      
      setStats(dashboardStats);
      setPostulacionesData(prev => ({
        ...prev,
        datasets: [{
          ...prev.datasets[0],
          data: postulacionesPorMes.datasets[0].data
        }]
      }));
      
      // Set sample data for postulacionesPorCargo
      setPostulacionesPorCargo({
        labels: ['Desarrollador', 'Diseñador', 'Producto', 'Marketing', 'Otros'],
        datasets: [{
          label: 'Postulaciones por Cargo',
          data: [45, 32, 28, 15, 8],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(239, 68, 68, 0.7)'
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(239, 68, 68, 1)'
          ],
          borderWidth: 1
        }]
      });
      
      setOfertasRecientes(ofertasRecientes);
      setActividadReciente(actividadReciente);
    } catch (err) {
      console.error('Error al cargar datos de ejemplo:', err);
      setError('Error al cargar los datos de ejemplo');
      toast.error('Error al cargar los datos de ejemplo');
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Intentar cargar datos reales primero
        try {
          const data = await empresaDashboardApi.getStats();
          setStats(data);
        } catch (apiError) {
          console.warn('Usando datos de ejemplo:', apiError);
          await loadSampleData();
        }
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('Error al cargar los datos del dashboard');
        toast.error('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    } else {
      // Si no hay usuario, cargar datos de ejemplo
      loadSampleData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Opciones para los gráficos
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard de Empresa</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* Sección de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Ofertas Activas"
          value={stats.ofertasActivas}
          total={stats.totalOfertas}
          description="Ofertas publicadas"
          icon={<FiBriefcase className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Nuevas Postulaciones"
          value={stats.postulacionesNuevas}
          total={stats.postulacionesTotales}
          description="Postulaciones totales"
          icon={<FiUsers className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="Tasa de Contratación"
          value={`${(stats.tasaContratacion * 100).toFixed(1)}%`}
          description="Éxito en contrataciones"
          icon={<FiTrendingUp className="w-6 h-6" />}
          color="purple"
        />
        <MetricCard
          title="Tiempo Promedio"
          value={`${stats.tiempoPromedioContratacion}d`}
          description="Días para contratación"
          icon={<FiClock className="w-6 h-6" />}
          color="yellow"
        />
      </div>

      {/* Sección de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Postulaciones por Mes</h2>
          <div className="h-80">
            <Line data={postulacionesData} options={lineChartOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Postulaciones por Cargo</h2>
          <div className="h-80">
            <Bar data={postulacionesPorCargo} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Sección de Ofertas Recientes */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Ofertas Recientes</h2>
          <Link 
            href="/empresas/dashboard/ofertas"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver todas las ofertas →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puesto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Postulaciones</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ofertasLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : ofertas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FiBriefcase className="h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-gray-500">No hay ofertas publicadas</p>
                      <Link 
                        href="/empresas/dashboard/ofertas/crear"
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Crear primera oferta
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                ofertas.slice(0, 5).map((oferta) => (
                  <tr key={oferta.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        href={`/empresas/dashboard/ofertas/${oferta.id}`}
                        className="hover:underline flex items-center"
                      >
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                          <FiBriefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 hover:text-blue-600">
                            {oferta.titulo}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {oferta.modalidad?.replace('_', ' ')}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {oferta.ubicacion || 'No especificada'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {oferta.tipoTrabajo || 'Tiempo completo'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        href={`/empresas/dashboard/ofertas/${oferta.id}/postulaciones`}
                        className="hover:underline"
                      >
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 hover:bg-green-200">
                          {oferta.postulaciones?.length || 0} postulaciones
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          oferta.estado === 'publicada' 
                            ? 'bg-green-100 text-green-800' 
                            : oferta.estado === 'cerrada'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {oferta.estado === 'publicada' 
                          ? 'Publicada' 
                          : oferta.estado === 'cerrada' 
                            ? 'Cerrada' 
                            : 'Borrador'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Componente para las tarjetas de métricas
function MetricCard({ title, value, total, description, icon, color, onClick }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  const iconBgClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    purple: 'bg-purple-100',
  };

  return (
    <div 
      className={`p-6 rounded-xl ${colorClasses[color]} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-end mt-1">
            <p className="text-2xl font-semibold">{value}</p>
            {total !== undefined && (
              <p className="ml-2 text-sm text-gray-500">/ {total} total</p>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgClasses[color]} bg-opacity-50`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
