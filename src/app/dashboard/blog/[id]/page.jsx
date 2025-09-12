'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi';
import api from '../../../../app/lib/api';
import CommentSection from '../../../../app/components/blog/CommentSection';

// Función para decodificar el token JWT
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export default function PostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Obtener el token directamente del localStorage
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setToken(authToken);
    
    // Verificar si el token es válido y obtener el rol del usuario
    if (authToken) {
      const payload = parseJwt(authToken);
      if (payload) {
        setIsAdmin(payload.rol === 'admin' || payload.rol === 'empresa');
      } else {
        console.error('Token inválido o no se pudo decodificar');
        setIsAdmin(false);
      }
    }
    
    let isMounted = true;
    
    const fetchPost = async () => {
      try {
        const postResponse = await api.get(`/api/posts/${id}`);
        const postData = postResponse.data;

        if (isMounted) {
          // Mostrar el post si está publicado o si el usuario es admin
          if (postData.publicado || isAdmin) {
            setPost(postData);
          } else {
            setError('Esta publicación no está disponible');
          }
        }
      } catch (error) {
        console.error('Error al cargar el post:', error);
        if (isMounted) {
          if (error.response?.status === 404) {
            setError('La publicación no fue encontrada');
          } else if (error.response?.status === 403) {
            setError('No tienes permiso para ver esta publicación');
          } else {
            setError('Error al cargar la publicación');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchPost();
    
    return () => {
      isMounted = false;
    };
  }, [id, isAdmin]); // Incluimos isAdmin en las dependencias para actualizar cuando cambie

  const handleDelete = async () => {
    if (!token) {
      setError('Debes iniciar sesión para eliminar publicaciones');
      router.push('/auth/login');
      return;
    }
    
    if (!isAdmin) {
      setError('No tienes permisos para realizar esta acción');
      return;
    }
    
    if (window.confirm('¿Estás seguro de eliminar esta publicación?')) {
      try {
        await api.delete(`/api/posts/${id}`);
        router.push('/dashboard/blog');
      } catch (error) {
        console.error('Error al eliminar:', error);
        if (error.response?.status === 401) {
          setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          router.push('/auth/login');
        } else if (error.response?.status === 403) {
          setError('No tienes permiso para eliminar esta publicación');
        } else {
          setError('Error al eliminar la publicación');
        }
      }
    }
  };

  const handleEdit = () => {
    if (!token) {
      setError('Debes iniciar sesión para editar publicaciones');
      router.push('/auth/login');
      return;
    }
    
    if (!isAdmin) {
      setError('No tienes permisos para editar publicaciones');
      return;
    }
    
    router.push(`/dashboard/blog/editar/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-gray-900">Publicación no encontrada</h2>
        <p className="mt-2 text-gray-600">La publicación que buscas no existe o no tienes permiso para verla.</p>
        <Link href="/dashboard/blog" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800">
          <FiArrowLeft className="mr-1" /> Volver al blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/dashboard/blog" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
        >
          <FiArrowLeft className="mr-1" /> Volver al blog
        </Link>
        
        <div className="flex justify-end space-x-2 mb-4">
          <Link 
            href={`/dashboard/blog/editar/${post.id}`}
            className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm hover:bg-yellow-200 flex items-center"
          >
            <FiEdit className="mr-1" /> Editar
          </Link>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200 flex items-center"
          >
            <FiTrash2 className="mr-1" /> Eliminar
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.titulo}</h1>
        
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>
            {new Date(post.fechaPublicacion || post.createdAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span className="mx-2">•</span>
          <span>{post.autor?.nombre || 'Autor desconocido'}</span>
        </div>

        {post.imagenUrl && (
          <div className="mb-8">
            <img 
              src={post.imagenUrl} 
              alt={post.titulo} 
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.contenido }} />
      </div>
    </div>
  );
}
