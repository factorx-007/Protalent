'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import api from '../../lib/api';

const EmpresaForm = ({ empresaId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(!!empresaId);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    rubro: '',
    usuarioId: 1, // This should be set to the current user's ID
  });

  useEffect(() => {
    if (empresaId) {
      fetchEmpresa();
    }
  }, [empresaId]);

  const fetchEmpresa = async () => {
    try {
      const { data } = await api.get(`/api/empresas/${empresaId}`);
      setFormData(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los datos de la empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (empresaId) {
        await api.put(`/api/empresas/${empresaId}`, formData);
        toast.success('Empresa actualizada correctamente');
      } else {
        await api.post('/api/empresas', formData);
        toast.success('Empresa creada correctamente');
      }
      router.push('/dashboard/empresas');
    } catch (error) {
      console.error('Error:', error);
      const message = error.response?.data?.message || 'Error al guardar la empresa';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && empresaId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {empresaId ? 'Editar Empresa' : 'Nueva Empresa'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Empresa *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>



          <div className="md:col-span-2">
            <label htmlFor="rubro" className="block text-sm font-medium text-gray-700 mb-1">
              Rubro
            </label>
            <input
              type="text"
              id="rubro"
              name="rubro"
              value={formData.rubro}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2 text-black">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows="4"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          
          {/* Hidden field for usuarioId */}
          <input type="hidden" name="usuarioId" value={formData.usuarioId} />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard/empresas')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmpresaForm;
