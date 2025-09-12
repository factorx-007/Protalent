'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/auth/AuthContext'; // Ajusta la ruta si es necesario
import { FiUser, FiSave, FiCamera, FiMail, FiLock, FiBriefcase, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function EditarPerfilPage() {
  const { user, loadUser } = useAuth(); // Asumimos que loadUser refresca los datos del usuario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    // Para cambio de contraseña
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    // Campos adicionales según rol
    titularProfesional: '', // Para candidatos
    // avatarFile: null, // Para la subida de avatar
  });
  const [selectedAvatarPreview, setSelectedAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const avatarFileRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nombre: user.nombre || '',
        email: user.email || '',
        titularProfesional: user.titularProfesional || '' // Asegúrate que este campo exista en tu modelo User
      }));
      setSelectedAvatarPreview(user.avatarUrl || null); // Asume que user.avatarUrl existe
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // setFormData(prev => ({ ...prev, avatarFile: file })); // Guardar el archivo para la subida
      setSelectedAvatarPreview(URL.createObjectURL(file));
      toast.info("Subida de avatar aún no implementada. Esta es solo una previsualización.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      toast.error('Las nuevas contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    // Crear un objeto con los datos a enviar, excluyendo campos vacíos de contraseña
    const updateData = {
      nombre: formData.nombre,
      email: formData.email,
      titularProfesional: user?.rol === 'candidato' ? formData.titularProfesional : undefined,
    };

    if (formData.newPassword && formData.currentPassword) {
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
    }
    
    // Aquí iría la lógica para subir el avatar si formData.avatarFile existe
    // y luego incluir la URL del avatar en updateData.

    try {
      // Simulación de llamada a API - Reemplaza con tu endpoint real
      // const response = await fetch('/api/auth/perfil/actualizar', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json', /* Authorization header si es necesario */ },
      //   body: JSON.stringify(updateData),
      // });
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.mensaje || 'Error al actualizar el perfil');
      // }

      // Simulación exitosa:
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay de API
      console.log("Datos a enviar (simulado):", updateData);
      toast.success('Perfil actualizado exitosamente (simulado)!');
      // await loadUser(); // Recargar datos del usuario en el contexto si la API fue real
      
      // Limpiar campos de contraseña después de un intento exitoso (o fallido)
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));

    } catch (error) {
      toast.error(error.message || 'Error al actualizar el perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center p-10">Cargando datos del perfil...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center">Editar Mi Perfil</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Columna de Avatar */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 mb-4 group">
              <Image 
                src={selectedAvatarPreview || user.avatarUrl || '/default-avatar.png'} // Asegúrate de tener un avatar por defecto
                alt="Avatar" 
                width={160} 
                height={160} 
                className="rounded-full object-cover border-4 border-indigo-200 shadow-md"
              />
              <input 
                type="file" 
                ref={avatarFileRef}
                onChange={handleAvatarChange} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                type="button"
                onClick={() => avatarFileRef.current?.click()} 
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center rounded-full transition-opacity duration-300 cursor-pointer"
                title="Cambiar foto de perfil"
              >
                <FiCamera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
            <button 
              type="button" 
              onClick={() => avatarFileRef.current?.click()}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium py-2 px-4 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Cambiar Foto
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">JPG, PNG, GIF. Máx 2MB.</p>
          </div>

          {/* Columna de Campos del Formulario */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required
                  className="mt-1 block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 hover:border-indigo-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
               <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required
                  className="mt-1 block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 hover:border-indigo-400"
                />
              </div>
            </div>
            
            {user?.rol === 'candidato' && (
              <div>
                <label htmlFor="titularProfesional" className="block text-sm font-medium text-gray-700 mb-1">Titular Profesional <span className="text-xs text-gray-400">(ej. Desarrollador Full Stack)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiBriefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="text" name="titularProfesional" id="titularProfesional" value={formData.titularProfesional} onChange={handleChange}
                    className="mt-1 block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 hover:border-indigo-400"
                    placeholder="Tu titular profesional"
                  />
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-700">Cambiar Contraseña</h3>
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiLock className="h-5 w-5 text-gray-400" /></div>
                    <input type={showCurrentPassword ? 'text' : 'password'} name="currentPassword" id="currentPassword" value={formData.currentPassword} onChange={handleChange}
                    className="mt-1 block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 hover:border-indigo-400"
                    />
                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600">
                        {showCurrentPassword ? <FiEyeOff/> : <FiEye/>}
                    </button>
                </div>
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiLock className="h-5 w-5 text-gray-400" /></div>
                    <input type={showNewPassword ? 'text' : 'password'} name="newPassword" id="newPassword" value={formData.newPassword} onChange={handleChange}
                    className="mt-1 block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 hover:border-indigo-400"
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600">
                        {showNewPassword ? <FiEyeOff/> : <FiEye/>}
                    </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiLock className="h-5 w-5 text-gray-400" /></div>
                    <input type={showConfirmNewPassword ? 'text' : 'password'} name="confirmNewPassword" id="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange}
                    className="mt-1 block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 hover:border-indigo-400"
                    />
                    <button type="button" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600">
                        {showConfirmNewPassword ? <FiEyeOff/> : <FiEye/>}
                    </button>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-60 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <><FiSave className="w-5 h-5"/> Guardar Cambios</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 