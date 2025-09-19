'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/auth/AuthContext';
import { empresaPerfilApi } from '../../../lib/empresaApi';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiBriefcase, FiEdit2, FiSave, FiX, FiUpload, FiLinkedin, FiTwitter, FiFacebook, FiInstagram } from 'react-icons/fi';

export default function PerfilPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [formData, setFormData] = useState({
    ruc: '',
    nombre_empresa: '',
    rubro: '',
    descripcion: '',
    direccion: '',
    telefono: '',
  });

  // Cargar datos reales de la empresa
  useEffect(() => {
    if (user && user.rol !== 'EMPRESA') {
      toast.error('Acceso denegado. Solo empresas pueden acceder a este perfil.');
      router.push('/dashboard');
      return;
    }

    if (user && user.rol === 'EMPRESA') {
      cargarPerfilEmpresa();
    }
  }, [user, router]);

  const cargarPerfilEmpresa = async () => {
    try {
      setIsLoading(true);
      const data = await empresaPerfilApi.obtenerPerfil();
      
      if (data.empresa) {
        setFormData({
          ruc: data.empresa.ruc || '',
          nombre_empresa: data.empresa.nombre_empresa || '',
          rubro: data.empresa.rubro || '',
          descripcion: data.empresa.descripcion || '',
          direccion: data.empresa.direccion || '',
          telefono: data.empresa.telefono || '',
        });
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      toast.error('Error al cargar el perfil de la empresa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuardar = async () => {
    try {
      setIsSaving(true);
      await empresaPerfilApi.actualizarPerfil(formData);
      toast.success('Perfil actualizado exitosamente');
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Perfil de Empresa</h1>
          <p className="text-gray-600 mt-2">Gestiona la información de tu empresa</p>
        </div>
        <div className="flex space-x-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiEdit2 className="mr-2 h-4 w-4" />
              Editar Perfil
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleGuardar}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                <FiSave className="mr-2 h-4 w-4" />
                {isSaving ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  cargarPerfilEmpresa(); // Recargar datos originales
                }}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <FiX className="mr-2 h-4 w-4" />
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Información básica */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Básica</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Empresa
            </label>
            {isEditing ? (
              <input
                type="text"
                name="nombre_empresa"
                value={formData.nombre_empresa}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{formData.nombre_empresa || 'No especificado'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RUC
            </label>
            {isEditing ? (
              <input
                type="text"
                name="ruc"
                value={formData.ruc}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{formData.ruc || 'No especificado'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rubro
            </label>
            {isEditing ? (
              <input
                type="text"
                name="rubro"
                value={formData.rubro}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{formData.rubro || 'No especificado'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            {isEditing ? (
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{formData.telefono || 'No especificado'}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            {isEditing ? (
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{formData.direccion || 'No especificada'}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            {isEditing ? (
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe tu empresa..."
              />
            ) : (
              <p className="text-gray-900">{formData.descripcion || 'No especificada'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
