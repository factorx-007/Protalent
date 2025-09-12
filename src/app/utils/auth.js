/**
 * Obtiene el token JWT almacenado en localStorage.
 * @returns {string|null} El token o null si no existe.
 */
export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
} 