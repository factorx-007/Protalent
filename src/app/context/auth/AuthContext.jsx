'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@lib/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true; // Para evitar actualizaciones de estado en un componente desmontado
    console.log('🔄 [AuthContext] Iniciando efecto de autenticación');

    const initializeAuth = async () => {
      console.log('🔑 [AuthContext] Verificando token en localStorage');
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      // console.log("[AuthContext] Token obtenido de localStorage:", token);

      if (token && token !== 'null' && token !== 'undefined') {
        console.log('🔑 [AuthContext] Token encontrado, configurando en headers de Axios');
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        console.log('⚠️ [AuthContext] No hay token válido en localStorage');
        delete api.defaults.headers.common['Authorization'];
      }

      if (!api.defaults.headers.common['Authorization']) {
        console.log('⚠️ [AuthContext] No hay cabecera de autorización, estableciendo usuario a null');
        if (isMounted) {
          console.log('👤 [AuthContext] Estableciendo usuario a null');
          setUser(null);
          setLoading(false);
        }
        return;
      }

      console.log('🔍 [AuthContext] Hay cabecera de autorización, cargando perfil...');
      try {
        console.log('📡 [AuthContext] Haciendo petición a /api/auth/perfil');
        const { data } = await api.get('/api/auth/perfil');
        console.log('✅ [AuthContext] Perfil cargado exitosamente:', {
          id: data.user?.id,
          nombre: data.user?.nombre,
          rol: data.user?.rol,
          tieneEmpresa: !!data.user?.empresa
        });
        if (isMounted) {
          console.log('👤 [AuthContext] Estableciendo usuario en el estado');
          setUser(data.user);
        }
      } catch (error) {
        console.error('❌ [AuthContext] Error al cargar perfil:', {
          status: error.response?.status,
          message: error.message,
          error: error.response?.data
        });
        
        if (isMounted) {
          console.log('👤 [AuthContext] Estableciendo usuario a null por error');
          setUser(null);
        }
        
        // Si el error es 401 o 403, limpiamos el token
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log('🔒 [AuthContext] Token inválido o expirado, limpiando...');
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();
    
    return () => {
        isMounted = false;
    };
  }, []); // Se ejecuta solo una vez cuando AuthProvider se monta

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user); 
      setLoading(false);
      
      // Usar la redirección proporcionada por el backend o fallback por defecto
      if (data.redirectTo) {
        router.push(data.redirectTo);
      } else if (data.user.rol === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (data.user.rol === 'EMPRESA') {
        router.push('/empresas/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("[AuthContext] Error en login:", error.response?.data || error.message);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData) => {
    // ... (similar a login si el registro también loguea al usuario)
    // Por ahora, asumamos que después de registrar, el usuario debe loguearse por separado
    setLoading(true);
    try {
      const response = await api.post('/api/auth/register', userData);
      // console.log("[AuthContext] Registro exitoso:", response.data);

      // Si el registro devuelve un token (como en tu documentación), podemos loguear directamente
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setUser(response.data.usuario);
        setLoading(false);
        
        // Redirigir según el rol del usuario
        if (response.data.usuario.rol === 'empresa') {
          router.push('/empresas/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        // Si no devuelve token, redirigir al login para que el usuario inicie sesión
        setUser(null); 
        setLoading(false);
        router.push('/auth/login?status=registered');
      }
    } catch (error) {
      console.error("[AuthContext] Error en register:", error.response?.data || error.message);
      setUser(null);
      setLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async (credential, rol) => {
    setLoading(true);
    try {
      if (!credential) {
        throw new Error('No se pudo obtener el token de Google');
      }

      const { data } = await api.post('/api/auth/google', { 
        credential,
        rol: rol || 'estudiante'
      });
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data.user);
        setLoading(false);

        // Usar la redirección proporcionada por el backend
        if (data.redirectTo) {
          router.push(data.redirectTo);
        } else if (data.necesitaCompletarPerfil) {
          // Redirigir a completar perfil según el rol
          if (data.user.rol === 'EMPRESA') {
            router.push('/auth/completar-perfil-empresa');
          } else {
            router.push('/perfil/completar');
          }
        } else {
          // Fallback por defecto
          if (data.user.rol === 'ADMIN') {
            router.push('/admin/dashboard');
          } else if (data.user.rol === 'EMPRESA') {
            router.push('/empresas/dashboard');
          } else {
            router.push('/dashboard');
          }
        }
      } else {
        throw new Error('No se recibió un token válido del servidor');
      }
    } catch (error) {
      console.error("[AuthContext] Error en loginWithGoogle:", error.response?.data || error.message);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
      throw error;
    }
  };

  const registerWithGoogle = async ({ credential, rol }) => {
    setLoading(true);
    try {
      if (!credential) {
        throw new Error('No se pudo obtener el token de Google');
      }
      if (!rol) {
        throw new Error('No se especificó el tipo de cuenta');
      }

      console.log('Enviando token de Google al backend...', { rol });
      const { data } = await api.post('/api/auth/google', { 
        credential,
        rol
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Respuesta del servidor en registerWithGoogle:', data);
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        
        // Asegurarnos de que el rol esté presente en el objeto de usuario
        const userData = data.user || data.usuario;
        if (userData && !userData.rol && rol) {
          userData.rol = rol;
        }
        
        console.log('Actualizando estado del usuario con:', userData);
        setUser(userData);
        setLoading(false);

        // Verificar si necesita completar el perfil
        if (data.necesitaCompletarPerfil === true) {
          console.log('Redirigiendo a la página de completar perfil');
          // Redirigir a la página de completar perfil
          router.push('/perfil/completar');
        } else if (data.redirectTo) {
          console.log('Redirigiendo a:', data.redirectTo);
          router.push(data.redirectTo);
        } else {
          console.log('Redirigiendo según el rol del usuario');
          // Redirigir según el rol del usuario
          if (userData.rol === 'empresa') {
            router.push('/empresas/dashboard');
          } else {
            router.push('/dashboard');
          }
        }
      } else {
        throw new Error('No se recibió un token válido del servidor');
      }
    } catch (error) {
      console.error("[AuthContext] Error en registerWithGoogle:", error.response?.data || error.message);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
      throw error;
    }
  };

  const handleCompleteProfile = async (userData) => {
    console.log('handleCompleteProfile llamado con:', userData);
    try {
      // Actualizar el estado local
      setUser(prev => ({
        ...prev,
        ...userData,
        perfilCompleto: true
      }));
      
      // Redirigir según el rol del usuario
      console.log('Redirigiendo después de completar perfil');
      if (userData.rol === 'empresa') {
        router.push('/empresas/dashboard');
      } else {
        router.push('/dashboard');
      }
      
      // Forzar recarga para asegurar que todo se actualice correctamente
      router.refresh();
    } catch (error) {
      console.error('Error al manejar el perfil completado:', error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  };

  const logout = async () => {
    // console.log("[AuthContext] Ejecutando logout...");
    try {
      // La llamada al backend es opcional y para invalidar el token del lado del servidor si existe tal lógica
    await api.post('/api/auth/logout');
    } catch (error) {
      // console.error("[AuthContext] Error en llamada a /api/auth/logout (no crítico):");
    }
    
    // Limpieza del lado del cliente (esto es lo crucial)
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null); 
    setLoading(false); // Asegurar que loading sea false para que AuthNavbar reaccione correctamente
    
    // console.log("[AuthContext] Token eliminado, usuario seteado a null. Redirigiendo...");
    router.push('/auth/login'); // Forzar recarga de página a login
  };

  console.log('=== Renderizando AuthProvider ===');
  console.log('user:', user);
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      register, 
      loginWithGoogle, 
      registerWithGoogle, 
      logout, 
      handleCompleteProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);