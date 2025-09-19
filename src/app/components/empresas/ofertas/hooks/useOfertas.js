import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@lib/axios';

export function useOfertas(user, authLoading = false) {
  const router = useRouter();
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    estado: 'todos',
    modalidad: 'todos',
    fecha: 'recientes',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Obtener ofertas de la empresa
  const fetchOfertas = useCallback(async () => {
    console.log('🔍 [useOfertas] fetchOfertas llamado con user:', user, 'authLoading:', authLoading);
    
    // Si aún está cargando la autenticación, no hacer nada
    if (authLoading) {
      console.log('⏳ [useOfertas] AuthContext aún cargando, esperando...');
      return;
    }
    
    if (!user || user.rol?.toUpperCase() !== 'EMPRESA' || (!user.empresa?.id && !user.empresaId)) {
      console.error('❌ [useOfertas] Usuario no es una empresa o falta ID de empresa', { 
        tieneUser: !!user, 
        rol: user?.rol,
        tieneEmpresaId: user?.empresa?.id,
        empresaId: user?.empresaId,
        userCompleto: user
      });
      console.log('🔄 [useOfertas] Estableciendo loading a false (usuario no válido)');
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 [useOfertas] Estableciendo loading a true');
      setLoading(true);
      
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        q: searchTerm,
        ...(filters.estado !== 'todos' && { estado: filters.estado }),
        ...(filters.modalidad !== 'todos' && { modalidad: filters.modalidad }),
      });

      const empresaId = user.empresa?.id || user.empresaId;
      console.log(`🌐 [useOfertas] Solicitando ofertas para empresa ID: ${empresaId}`);
      const response = await api.get(`/api/ofertas/empresa/${empresaId}`, { params });
      console.log('📦 [useOfertas] Respuesta recibida:', {
        status: response.status,
        totalOfertas: response.data?.ofertas?.length,
        data: response.data
      });
      
      const ofertasRecibidas = response.data.ofertas || [];
      console.log('📋 [useOfertas] Ofertas procesadas:', ofertasRecibidas.map(o => ({
        id: o.id,
        titulo: o.titulo,
        estado: o.estado,
        modalidad: o.modalidad,
        ubicacion: o.ubicacion,
        salario: o.salario,
        duracion: o.duracion,
        postulaciones: o.postulaciones?.length || 0
      })));
      
      setOfertas(ofertasRecibidas);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 1,
      }));
    } catch (error) {
      console.error('Error al obtener ofertas:', error);
      toast.error('Error al cargar las ofertas');
    } finally {
      console.log('🔄 [useOfertas] Estableciendo loading a false (finally)');
      setLoading(false);
    }
  }, [user, searchTerm, filters, pagination.page, pagination.limit, authLoading]);

  // Cargar ofertas cuando cambian los filtros o la búsqueda
  useEffect(() => {
    console.log('🔄 [useOfertas] useEffect ejecutándose');
    fetchOfertas();
    
    // Limpiar el estado cuando el componente se desmonte o el usuario cambie
    return () => {
      console.log('🧹 [useOfertas] Limpiando estado');
      setOfertas([]);
      setLoading(true);
    };
  }, [fetchOfertas]);

  // Cambiar página
  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  // Eliminar oferta
  const handleDeleteOferta = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta oferta?')) {
      return;
    }

    try {
      await api.delete(`/api/ofertas/${id}`);
      toast.success('Oferta eliminada correctamente');
      fetchOfertas(); // Recargar ofertas
    } catch (error) {
      console.error('Error al eliminar oferta:', error);
      toast.error('Error al eliminar la oferta');
    }
  };

  // Cambiar estado de la oferta
  const toggleOfertaEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 'publicada' ? 'cerrada' : 'publicada';
    
    try {
      await api.put(`/api/ofertas/${id}/estado`, { estado: nuevoEstado });
      toast.success(`Oferta ${nuevoEstado === 'publicada' ? 'publicada' : 'cerrada'} correctamente`);
      fetchOfertas(); // Recargar ofertas
    } catch (error) {
      console.error('Error al cambiar estado de la oferta:', error);
      toast.error('Error al actualizar el estado de la oferta');
    }
  };

  return {
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
    refreshOfertas: fetchOfertas,
  };
}
