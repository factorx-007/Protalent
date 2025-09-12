'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import api from '../../../../../app/lib/api';

export default function EditarPost() {
  const router = useRouter();
  const { id } = useParams();
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    categoriaId: '',
    publicado: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener categorías
        const catResponse = await api.get('/api/categorias');
        setCategorias(catResponse.data);

        // Obtener datos del post
        const postResponse = await api.get(`/api/posts/${id}`);
        const postData = postResponse.data;
        
        setFormData({
          titulo: postData.titulo,
          contenido: postData.contenido,
          categoriaId: postData.categoriaId,
          publicado: postData.publicado,
        });
      } catch (err) {
        console.error('Error al cargar datos:', err);
        if (err.response?.status === 404) {
          setError('La publicación no fue encontrada');
        } else if (err.response?.status === 403) {
          setError('No tienes permiso para editar esta publicación');
        } else {
          setError('Error al cargar la publicación');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put(`/api/posts/${id}`, formData);
      router.push('/dashboard/blog');
    } catch (err) {
      console.error('Error al actualizar:', err);
      if (err.response?.status === 401) {
        setError('No estás autenticado. Por favor, inicia sesión nuevamente.');
      } else if (err.response?.status === 403) {
        setError('No tienes permiso para editar esta publicación');
      } else {
        setError('Error al actualizar la publicación');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Cargando...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          <FiArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">Editar Publicación</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="categoriaId" className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              id="categoriaId"
              name="categoriaId"
              value={formData.categoriaId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="contenido" className="block text-sm font-medium text-gray-700">
              Contenido
            </label>
            <textarea
              id="contenido"
              name="contenido"
              rows={10}
              value={formData.contenido}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              id="publicado"
              name="publicado"
              type="checkbox"
              checked={formData.publicado}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="publicado" className="ml-2 block text-sm text-gray-700">
              Publicado
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard/blog')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <FiSave className="mr-2 h-4 w-4" />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
