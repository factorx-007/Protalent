'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  FiUser, 
  FiThumbsUp, 
  FiMessageSquare, 
  FiShare2, 
  FiMoreHorizontal,
  FiEdit2,
  FiTrash2
} from 'react-icons/fi';
import CommentSection from './CommentSection';

export default function PostCard({ 
  post, 
  onDelete,
  showActions = true 
}) {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  const toggleComments = () => setShowComments(!showComments);

  const handleLike = () => {
    // Aquí iría la llamada a la API para dar like
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar esta publicación?')) {
      onDelete(post.id);
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
      {/* Encabezado */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-600">
              <FiUser className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {post.autor?.nombre || 'Usuario'}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(post.fechaPublicacion || post.createdAt), { 
                    addSuffix: true, 
                    locale: es 
                  })}
                </span>
                {post.categoria && (
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                    {post.categoria.nombre}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
            <FiMoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 pb-2">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{post.titulo}</h2>
        <div 
          className="prose prose-indigo max-w-none text-gray-700 mb-3"
          dangerouslySetInnerHTML={{ __html: post.contenido }}
        />
        {post.imagenUrl && (
          <div className="mt-3 rounded-lg overflow-hidden border border-gray-100">
            <img 
              src={post.imagenUrl} 
              alt={post.titulo} 
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="px-4 py-2 border-t border-b border-gray-100 text-sm text-gray-500 flex justify-between">
        <div className="flex items-center space-x-1">
          <div className="bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
            <FiThumbsUp className="h-3 w-3" />
          </div>
          <span>{likes}</span>
        </div>
        <button 
          onClick={toggleComments}
          className="hover:underline"
        >
          {post.comentarios?.length || 0} comentarios
        </button>
      </div>

      {/* Acciones */}
      <div className="px-2 py-1">
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          <button 
            onClick={handleLike}
            className={`flex items-center justify-center py-2 text-sm font-medium rounded-md transition-colors ${
              isLiked 
                ? 'text-indigo-600' 
                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <FiThumbsUp className="mr-2" /> Me gusta
          </button>
          <button 
            onClick={toggleComments}
            className="flex items-center justify-center py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
          >
            <FiMessageSquare className="mr-2" /> Comentar
          </button>
          <button className="flex items-center justify-center py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
            <FiShare2 className="mr-2" /> Compartir
          </button>
        </div>
      </div>

      {/* Comentarios */}
      {showComments && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <CommentSection 
            postId={post.id} 
            initialComments={post.comentarios || []} 
          />
        </div>
      )}

      {/* Acciones de administración */}
      {showActions && (
        <div className="border-t border-gray-100 p-2 bg-gray-50 flex justify-end space-x-2">
          <Link 
            href={`/dashboard/blog/editar/${post.id}`}
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
          >
            <FiEdit2 className="mr-1.5 h-4 w-4" /> Editar
          </Link>
          <button 
            onClick={handleDelete}
            className="text-sm text-red-600 hover:text-red-800 flex items-center px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
          >
            <FiTrash2 className="mr-1.5 h-4 w-4" /> Eliminar
          </button>
        </div>
      )}
    </article>
  );
}
