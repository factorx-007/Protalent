'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
// Quitamos useAuthUser si la lógica de empresaId no dependerá directamente del rol del usuario logueado aquí,
// sino de una selección explícita. La página contenedora (CrearOfertaPage) ya maneja la restricción de rol.

export default function OfertaForm({ oferta }) {
  const [formData, setFormData] = useState(oferta || {
    titulo: '',
    descripcion: '',
    requisitos: '',
    duracion: '',
    requiereCV: true,
    requiereCarta: false,
    empresaId: '', // Se seleccionará de la lista
  });
  const [empresas, setEmpresas] = useState([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Cargar la lista de empresas para el selector
    api.get('/api/empresas') // Asume que este endpoint devuelve todas las empresas
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          setEmpresas(response.data);
        } else {
          console.error('La respuesta de /api/empresas no es un array válido:', response.data);
          setEmpresas([]); // Asegura que empresas sea un array
          alert('Error: No se pudo cargar la lista de empresas correctamente.');
        }
      })
      .catch(err => {
        console.error('Error al obtener la lista de empresas:', err);
        alert('Error al cargar la lista de empresas. Intenta recargar la página.');
        setEmpresas([]); // Asegura que empresas sea un array en caso de error
      })
      .finally(() => {
        setLoadingEmpresas(false);
      });

    // Si es una edición, el empresaId ya debería estar en el objeto 'oferta'
    // y se establece en el estado inicial de formData.
    // Si el empresaId de la oferta editada no coincide con ninguna empresa cargada,
    // el select podría no mostrarlo correctamente, pero el ID se conservará.
  }, []); // Solo se ejecuta una vez al montar el componente

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.empresaId) {
      alert('Error: Debes seleccionar una empresa para la oferta.');
      return;
    }

    try {
      let response;
      if (oferta) {
        response = await api.put(`/api/ofertas/${oferta.id}`, formData);
      } else {
        response = await api.post('/api/ofertas', formData);
      }
      // console.log('Respuesta del servidor:', response.data);
      router.push('/dashboard/ofertas');
    } catch (error) {
      console.error('Error al guardar la oferta:', error.response?.data || error.message);
      alert(`Error al guardar la oferta: ${error.response?.data?.detalle || error.response?.data?.error || error.message}`);
    }
  };

  if (loadingEmpresas && !oferta) { // Mostrar carga solo si es creación y se están cargando empresas
    return <p>Cargando lista de empresas...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-black">
      <div>
        <label htmlFor="titulo" className="block mb-1 font-medium">Título *</label>
        <input
          id="titulo"
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />
      </div>
      
      <div>
        <label htmlFor="empresaId" className="block mb-1 font-medium">Empresa *</label>
        <select
          id="empresaId"
          name="empresaId"
          value={formData.empresaId}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded bg-white"
          disabled={loadingEmpresas || empresas.length === 0}
        >
          <option value="" disabled>Selecciona una empresa</option>
          {empresas.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.nombre}
            </option>
          ))}
        </select>
        {empresas.length === 0 && !loadingEmpresas && (
          <p className="text-sm text-red-600 mt-1">No hay empresas disponibles. Por favor, registra una empresa primero.</p>
        )}
      </div>

      <div>
        <label htmlFor="descripcion" className="block mb-1 font-medium">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="requisitos" className="block mb-1 font-medium">Requisitos</label>
        <textarea
          id="requisitos"
          name="requisitos"
          value={formData.requisitos}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="duracion" className="block mb-1 font-medium">Duración</label>
        <input
          id="duracion"
          type="text"
          name="duracion"
          value={formData.duracion}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="requiereCV"
            checked={formData.requiereCV}
            onChange={handleChange}
            className="mr-2"
          />
          Requiere CV
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="requiereCarta"
            checked={formData.requiereCarta}
            onChange={handleChange}
            className="mr-2"
          />
          Requiere Carta
        </label>
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        disabled={loadingEmpresas || (!oferta && !formData.empresaId) || (empresas.length === 0 && !oferta)}
      >
        {oferta ? 'Actualizar' : 'Crear'} Oferta
      </button>
    </form>
  );
} 