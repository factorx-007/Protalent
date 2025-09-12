'use client';

import { useState } from 'react';
import { FiUser, FiSend, FiThumbsUp, FiMessageSquare } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function CommentSection({ postId, initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // Aquí iría la llamada a la API para crear el comentario
      // const response = await api.post(`/api/posts/${postId}/comments`, { content: newComment });
      // setComments([...comments, response.data]);
      
      // Simulación de respuesta exitosa
      const tempComment = {
        id: Date.now(),
        contenido: newComment,
        autor: { nombre: 'Tú' }, // Esto vendría del backend
        createdAt: new Date().toISOString(),
        likes: 0
      };
      
      setComments([...comments, tempComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error al publicar comentario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = (commentId) => {
    // Aquí iría la lógica para dar like a un comentario
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: (comment.likes || 0) + 1 } 
        : comment
    ));
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Formulario de comentario */}
      <form onSubmit={handleSubmit} className="flex items-start space-x-2 mb-4">
        <div className="flex-shrink-0 h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
          <FiUser className="h-4 w-4" />
        </div>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Escribe un comentario..."
            className="w-full border border-gray-200 rounded-full px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
          />
          <button 
            type="submit"
            disabled={isSubmitting}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-500 hover:text-indigo-700 disabled:opacity-50"
          >
            <FiSend className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Lista de comentarios */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3 group">
            <div className="flex-shrink-0 h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <FiUser className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none inline-block">
                <div className="flex items-baseline">
                  <h4 className="font-semibold text-sm text-gray-900 mr-2">
                    {comment.autor?.nombre || 'Usuario'}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { 
                      addSuffix: true, 
                      locale: es 
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-800 mt-1">{comment.contenido}</p>
                <div className="flex items-center mt-1 space-x-3">
                  <button 
                    onClick={() => handleLike(comment.id)}
                    className="text-xs text-gray-500 hover:text-indigo-600 flex items-center"
                  >
                    <FiThumbsUp className="mr-1" />
                    {comment.likes > 0 && comment.likes}
                  </button>
                  <button className="text-xs text-gray-500 hover:text-indigo-600 flex items-center">
                    <FiMessageSquare className="mr-1" /> Responder
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
