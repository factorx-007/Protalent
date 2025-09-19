'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Esquema de validación basado en el rol
const profileSchema = (rol) => {
  if (rol === 'estudiante' || rol === 'egresado') {
    const baseSchema = {
      carrera: z.string().min(3, 'La carrera es requerida'),
      telefono: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos'),
    };

    if (rol === 'egresado') {
      return z.object({
        ...baseSchema,
        anio_egreso: z.string()
          .min(4, 'El año de egreso debe tener 4 dígitos')
          .regex(/^\d{4}$/, 'Año de egreso inválido')
      });
    } else {
      return z.object({
        ...baseSchema,
        ciclo: z.string().optional()
      });
    }
  } 
  
  if (rol === 'empresa') {
    return z.object({
      nombre_empresa: z.string().min(3, 'El nombre de la empresa es requerido'),
      ruc: z.string()
        .min(11, 'El RUC debe tener 11 dígitos')
        .max(11, 'El RUC debe tener 11 dígitos')
        .regex(/^\d+$/, 'El RUC solo debe contener números'),
      rubro: z.string().min(3, 'El rubro es requerido'),
      telefono: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos'),
      direccion: z.string().min(5, 'La dirección es requerida')
    });
  }
  
  return z.object({
    telefono: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos')
  });
};

export default function CompleteProfileForm({ user, onComplete }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Asegurarnos de que el rol tenga un valor por defecto
  const userRole = user?.rol || 'estudiante';
  console.log('Rol del usuario en el formulario:', userRole);
  
  // Debug: Mostrar información del usuario y su rol
  useEffect(() => {
    console.log('CompleteProfileForm - Usuario actual:', user);
    console.log('CompleteProfileForm - Rol del usuario:', userRole);
    
    // Si el rol no está definido, mostramos un error
    if (!userRole) {
      console.error('Error: No se pudo determinar el rol del usuario');
      setError('Error: No se pudo determinar el tipo de cuenta. Por favor, cierra sesión y vuelve a intentarlo.');
    }
  }, [user, userRole]);
  
  const defaultValues = userRole === 'empresa' ? {
    nombre_empresa: user?.nombre_empresa || user?.nombreEmpresa || '', 
    ruc: user?.ruc || '',
    rubro: user?.rubro || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || ''
  } : {
    carrera: user?.carrera || '',
    anio_egreso: user?.anio_egreso || user?.año_egreso || '',
    ciclo: user?.ciclo || '',
    telefono: user?.telefono || ''
  };
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema(userRole)),
    defaultValues
  });

  const onSubmit = async (formData) => {
    console.log('Enviando datos del formulario:', formData);
    console.log('Rol del usuario al enviar:', userRole);
    setIsSubmitting(true);
    setError('');
    
    try {
      // Usar el endpoint correcto según el rol
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      let endpoint, method, requestBody;
      
      if (userRole === 'empresa') {
        endpoint = `${baseUrl}/api/auth/completar-perfil-empresa`;
        method = 'POST';
        requestBody = {
          ruc: formData.ruc,
          nombre_empresa: formData.nombre_empresa || formData.nombreEmpresa, // Aceptar ambos formatos por compatibilidad
          rubro: formData.rubro,
          direccion: formData.direccion,
          telefono: formData.telefono,
          descripcion: formData.descripcion || ''
        };
        
        console.log('Datos a enviar al backend:', requestBody);
      } else {
        // Para estudiantes y egresados
        endpoint = `${baseUrl}/api/auth/completar-perfil-estudiante`;
        method = 'POST';
        requestBody = {
          carrera: formData.carrera,
          telefono: formData.telefono
        };

        // Solo agregar año de egreso si es egresado
        if (userRole === 'egresado' && formData.anio_egreso) {
          requestBody.anio_egreso = formData.anio_egreso;
        }

        // Agregar ciclo si es estudiante y se proporcionó
        if (userRole === 'estudiante' && formData.ciclo) {
          requestBody.ciclo = formData.ciclo;
        }
        
        console.log('Enviando datos de estudiante/egresado:', requestBody);
      }

      console.log(`Enviando solicitud ${method} a ${endpoint}...`, requestBody);
      const response = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Respuesta del servidor:', response);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error en la respuesta:', errorData);
        throw new Error(errorData.error || 'Error al guardar los datos del perfil');
      }

      const data = await response.json();
      console.log('Datos guardados exitosamente:', data);

      // Actualizar el usuario en el contexto con los nuevos datos
      if (data.usuario || data.estudiante || data.empresa) {
        // Actualizar el token si viene en la respuesta
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        // Obtener los datos del usuario de la respuesta o usar los existentes
        const userFromResponse = data.usuario || data.user || {};
        
        // Preparar los datos actualizados del usuario
        const updatedUser = {
          ...user,
          ...userFromResponse, // Sobrescribir con los datos actualizados del servidor
          perfilCompleto: true,
          rol: userFromResponse.rol || userRole, // Asegurar que el rol esté presente
          // Agregar datos específicos del perfil según el rol
          ...(data.estudiante && {
            carrera: data.estudiante.carrera,
            anioIngreso: data.estudiante.año_egreso,
            telefono: data.estudiante.telefono,
            direccion: data.estudiante.direccion,
            tipo: userRole // Asegurar que el tipo esté establecido
          }),
          ...(data.empresa && {
            nombreEmpresa: data.empresa.nombre_empresa,
            ruc: data.empresa.ruc,
            rubro: data.empresa.rubro,
            telefono: data.empresa.telefono,
            direccion: data.empresa.direccion,
            tipo: 'empresa' // Asegurar que el tipo esté establecido
          })
        };
        
        console.log('Actualizando usuario con datos:', updatedUser);
        
        // Actualizar el usuario en el contexto
        onComplete(updatedUser);
        
        // Redirigir al dashboard después de actualizar el perfil
        router.push('/dashboard');
      } else if (data.mensaje) {
        // Si hay un mensaje de éxito pero no datos de usuario, igual redirigir
        console.log(data.mensaje);
        onComplete({ ...user, perfilCompleto: true });
        router.push('/dashboard');
      } else {
        console.error('No se recibieron datos de usuario en la respuesta:', data);
        throw new Error('Error al procesar la respuesta del servidor');
      }
    } catch (err) {
      console.error('Error al completar perfil:', err);
      setError(err.message || 'Error al actualizar el perfil. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar campos según el rol
  const renderFields = () => {
    if (!user?.rol) {
      console.log('No se encontró el rol del usuario');
      return null;
    }
    
    console.log('Renderizando campos para el rol:', user.rol);
    console.log('Datos del usuario:', user);

    // Campos para estudiantes y egresados
    if (user.rol === 'estudiante' || user.rol === 'egresado') {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="carrera" className="block text-sm font-medium text-gray-700">
              Carrera *
            </label>
            <select
              id="carrera"
              name="carrera"
              className={`mt-1 block w-full border ${errors.carrera ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              {...register('carrera')}
            >
              <option value="">Selecciona tu carrera</option>
              <option value="Ingeniería de Software">Ingeniería de Software</option>
              <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
              <option value="Ingeniería Industrial">Ingeniería Industrial</option>
              <option value="Ingeniería Mecánica">Ingeniería Mecánica</option>
              <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
              <option value="Ingeniería Civil">Ingeniería Civil</option>
              <option value="Administración de Empresas">Administración de Empresas</option>
              <option value="Contabilidad">Contabilidad</option>
              <option value="Marketing">Marketing</option>
              <option value="Diseño Gráfico">Diseño Gráfico</option>
              <option value="Arquitectura">Arquitectura</option>
              <option value="Otra">Otra</option>
            </select>
            {errors.carrera && (
              <p className="mt-1 text-sm text-red-600">{errors.carrera.message}</p>
            )}
          </div>

          {user.rol === 'egresado' && (
            <div>
              <label htmlFor="anio_egreso" className="block text-sm font-medium text-gray-700">
                Año de Egreso *
              </label>
              <input
                id="anio_egreso"
                name="anio_egreso"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                placeholder="2024"
                className={`mt-1 block w-full border ${errors.anio_egreso ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                {...register('anio_egreso')}
              />
              {errors.anio_egreso && (
                <p className="mt-1 text-sm text-red-600">{errors.anio_egreso.message}</p>
              )}
            </div>
          )}

          {user.rol === 'estudiante' && (
            <div>
              <label htmlFor="ciclo" className="block text-sm font-medium text-gray-700">
                Ciclo Actual (Opcional)
              </label>
              <select
                id="ciclo"
                name="ciclo"
                className={`mt-1 block w-full border ${errors.ciclo ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                {...register('ciclo')}
              >
                <option value="">Selecciona tu ciclo</option>
                <option value="1">1er Ciclo</option>
                <option value="2">2do Ciclo</option>
                <option value="3">3er Ciclo</option>
                <option value="4">4to Ciclo</option>
                <option value="5">5to Ciclo</option>
                <option value="6">6to Ciclo</option>
                <option value="7">7mo Ciclo</option>
                <option value="8">8vo Ciclo</option>
                <option value="9">9no Ciclo</option>
                <option value="10">10mo Ciclo</option>
              </select>
              {errors.ciclo && (
                <p className="mt-1 text-sm text-red-600">{errors.ciclo.message}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
              Teléfono *
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              placeholder="987654321"
              className={`mt-1 block w-full border ${errors.telefono ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              {...register('telefono')}
            />
            {errors.telefono && (
              <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
            )}
          </div>
        </div>
      );
    }
    
    // Campos para empresas
    if (user.rol === 'empresa') {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="nombre_empresa" className="block text-sm font-medium text-gray-700">
              Nombre de la Empresa *
            </label>
            <input
              id="nombre_empresa"
              name="nombre_empresa"
              type="text"
              className={`mt-1 block w-full border ${errors.nombre_empresa ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              {...register('nombre_empresa')}
            />
            {errors.nombre_empresa && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre_empresa.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ruc" className="block text-sm font-medium text-gray-700">
              RUC
            </label>
            <input
              id="ruc"
              name="ruc"
              type="text"
              inputMode="numeric"
              maxLength={11}
              className={`mt-1 block w-full border ${errors.ruc ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              {...register('ruc')}
            />
            {errors.ruc && (
              <p className="mt-1 text-sm text-red-600">{errors.ruc.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="rubro" className="block text-sm font-medium text-gray-700">
              Rubro
            </label>
            <input
              id="rubro"
              name="rubro"
              type="text"
              className={`mt-1 block w-full border ${errors.rubro ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              {...register('rubro')}
            />
            {errors.rubro && (
              <p className="mt-1 text-sm text-red-600">{errors.rubro.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              className={`mt-1 block w-full border ${errors.telefono ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              {...register('telefono')}
            />
            {errors.telefono && (
              <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <input
              id="direccion"
              name="direccion"
              type="text"
              className={`mt-1 block w-full border ${errors.direccion ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              {...register('direccion')}
            />
            {errors.direccion && (
              <p className="mt-1 text-sm text-red-600">{errors.direccion.message}</p>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h2 className="text-lg font-medium text-gray-900">Completa tu perfil</h2>
        <p className="mt-1 text-sm text-gray-600">
          Necesitamos algunos datos adicionales para continuar.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre Completo
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={user?.nombre || ''}
            disabled
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={user?.email || ''}
            disabled
          />
        </div>

        {renderFields()}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {error}
              </h3>
            </div>
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Perfil'}
        </button>
      </div>
    </form>
  );
}
