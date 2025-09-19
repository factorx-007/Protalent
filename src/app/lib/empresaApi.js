import api from './axios';

// Servicios para el dashboard de empresa
export const empresaDashboardApi = {
  // Obtener estadísticas del dashboard
  obtenerEstadisticas: async () => {
    try {
      const response = await api.get('/api/empresas/dashboard/estadisticas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  // Obtener actividad reciente
  obtenerActividad: async () => {
    try {
      const response = await api.get('/api/empresas/dashboard/actividad');
      return response.data;
    } catch (error) {
      console.error('Error al obtener actividad:', error);
      throw error;
    }
  }
};

// Servicios para el perfil de empresa
export const empresaPerfilApi = {
  // Obtener perfil de empresa
  obtenerPerfil: async () => {
    try {
      const response = await api.get('/api/empresas/perfil');
      return response.data;
    } catch (error) {
      console.error('Error al obtener perfil de empresa:', error);
      throw error;
    }
  },

  // Actualizar perfil de empresa
  actualizarPerfil: async (datosEmpresa) => {
    try {
      const response = await api.put('/api/empresas/perfil', datosEmpresa);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar perfil de empresa:', error);
      throw error;
    }
  }
};

// Servicios generales de empresa
export const empresaApi = {
  // Obtener todas las empresas (público)
  obtenerEmpresas: async () => {
    try {
      const response = await api.get('/api/empresas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener empresas:', error);
      throw error;
    }
  },

  // Obtener empresa por ID
  obtenerEmpresaPorId: async (id) => {
    try {
      const response = await api.get(`/api/empresas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener empresa por ID:', error);
      throw error;
    }
  },

  // Obtener empresa por usuario ID
  obtenerEmpresaPorUsuario: async (usuarioId) => {
    try {
      const response = await api.get(`/api/empresas/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener empresa por usuario:', error);
      throw error;
    }
  }
};
