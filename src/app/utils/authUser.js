import { useAuth } from '../context/auth/AuthContext';

/**
 * Hook para obtener el usuario autenticado de forma centralizada.
 * @returns {object} Objeto con el usuario autenticado, su estado de carga y funciones de utilidad
 */
export function useAuthUser() {
  const { user, loading } = useAuth();
  
  /**
   * Obtiene el ID del usuario autenticado
   * @returns {number|null} ID del usuario o null si no está autenticado
   */
  const getUserId = () => user?.id || null;
  
  return { 
    user, 
    loading,
    getUserId 
  };
} 