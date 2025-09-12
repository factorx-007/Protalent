'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { useAuthUser } from '../../utils/authUser';

export default function PostulacionForm({ postulacion, ofertaId }) {
  const { user, loading, getUserId } = useAuthUser();
  const [formData, setFormData] = useState(postulacion || {
    mensaje: '',
    estado: 'pendiente',
    usuarioId: '', // Inicialmente vacío, se llenará con useEffect
    ofertaId: ofertaId || '',
  });
  const router = useRouter();

  useEffect(() => {
    const currentUserId = getUserId(); // Obtiene user.id o null
    // console.log('[PostulacionForm] useEffect [user, getUserId]: currentUserId:', currentUserId, 'loading:', loading);
    if (!loading && currentUserId && formData.usuarioId !== currentUserId) {
      // console.log('[PostulacionForm] useEffect: Actualizando usuarioId en formData a:', currentUserId);
      setFormData(prev => ({
        ...prev,
        usuarioId: currentUserId,
      }));
    } else if (!loading && !currentUserId && formData.usuarioId) {
      // Si el usuario ya no está (o no tiene id) y el form aún tiene un id, limpiarlo
      // console.log('[PostulacionForm] useEffect: Limpiando usuarioId en formData.');
      setFormData(prev => ({
        ...prev,
        usuarioId: '',
      }));
    }
  }, [user, loading, getUserId, formData.usuarioId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // console.log('[PostulacionForm] handleSubmit: formData actual:', formData);
    
    if (!formData.ofertaId) {
      alert('Error: No se ha especificado la oferta para la postulación.');
      return;
    }

    const userIdOnSubmit = getUserId(); // Obtener el ID del usuario justo antes de enviar
    // console.log('[PostulacionForm] handleSubmit: userIdOnSubmit obtenido de getUserId():', userIdOnSubmit);

    if (!userIdOnSubmit) {
      alert('Error: Usuario no autenticado o ID de usuario no disponible. Por favor, inicia sesión.');
      // Considera no redirigir aquí para que el usuario vea el mensaje y el estado del form.
      // router.push('/auth/login'); 
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        usuarioId: userIdOnSubmit, // Asegura que se envía el ID más actualizado
      };
      // console.log('[PostulacionForm] handleSubmit: Enviando data:', dataToSend);
      
      if (postulacion) {
        await api.put(`/api/postulaciones/${postulacion.id}`, dataToSend);
      } else {
        await api.post('/api/postulaciones', dataToSend);
      }
      alert('Postulación guardada exitosamente!'); // Feedback al usuario
      router.push('/dashboard/postulaciones');
    } catch (error) {
      // console.error('[PostulacionForm] Error en postulación:', error.response?.data || error.message);
      alert(`Error al guardar la postulación: ${error.response?.data?.detalle || error.message}`);
    }
  };

  if (loading) {
    return <p>Cargando información del usuario...</p>; // Muestra un mensaje mientras carga
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-black">
      <div>
        <label className="block mb-1 font-medium">Mensaje</label>
        <textarea
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
      </div>
      {postulacion && (
        <div>
          <label className="block mb-1 font-medium">Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="pendiente">Pendiente</option>
            <option value="aceptada">Aceptada</option>
            <option value="rechazada">Rechazada</option>
          </select>
        </div>
      )}
      <input type="hidden" name="ofertaId" value={formData.ofertaId} />
      {/* El usuarioId se maneja internamente y se envía en handleSubmit,
          no es necesario un input oculto si se gestiona bien en el estado y dataToSend.
          Si se mantiene, asegurar que su 'value' sea el correcto: value={formData.usuarioId || ''} 
      */}
      {/* <input type="hidden" name="usuarioId" value={formData.usuarioId || ''} /> */}
      
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        // El disabled={loading} se maneja ahora mostrando "Cargando..."
      >
        {postulacion ? 'Actualizar' : 'Crear'} Postulación
      </button>
    </form>
  );
} 