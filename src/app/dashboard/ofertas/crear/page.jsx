'use client';

import OfertaForm from '../OfertaForm'; // Ajusta la ruta si es necesario
import OfertasNav from '../OfertasNav'; // Para mantener la navegación consistente
import Sidebar from '../../../components/views/Sidebar'; // Ajusta la ruta
import DashboardNavbar from '../../../components/views/DashboardNavbar'; // Ajusta la ruta
import { useAuthUser } from '../../../utils/authUser'; // Para verificar el rol del usuario
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CrearOfertaPage() {
  const { user, loading } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    // Si ya terminó de cargar y el usuario no existe o no es empresa, redirigir.
    if (!loading && (!user || user.rol.toUpperCase() !== 'EMPRESA')) {
      alert('Acceso denegado. Solo las empresas pueden crear ofertas.');
      router.push('/dashboard/ofertas'); // O a donde consideres apropiado
    }
  }, [user, loading, router]);

  // Muestra un estado de carga mientras se verifica el usuario
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardNavbar />
        <div className="flex min-h-screen flex-1">
          <Sidebar />
          <main className="flex-1 p-10 bg-gray-50 flex justify-center items-center">
            <p>Verificando autorización...</p>
          </main>
        </div>
      </div>
    );
  }

  // Si después de cargar, el usuario no es empresa (aunque el useEffect ya debería haber redirigido)
  if (!user || user.rol.toUpperCase() !== 'EMPRESA') {
    // Este return es un fallback, el useEffect debería actuar primero.
    return (
        <div className="flex flex-col min-h-screen">
            <DashboardNavbar />
            <div className="flex min-h-screen flex-1">
                <Sidebar />
                <main className="flex-1 p-10 bg-gray-50 flex justify-center items-center">
                    <p>Acceso denegado.</p>
                </main>
            </div>
        </div>
    );
  }

  // Si el usuario es empresa, renderiza el formulario
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar />
      <div className="flex min-h-screen flex-1">
        <Sidebar />
        <main className="flex-1 p-10 bg-gray-50">
          <OfertasNav /> 
          <div className="container mx-auto p-6 bg-white rounded-lg shadow mt-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Crear Nueva Oferta</h1>
            <OfertaForm /> {/* No se pasa 'oferta' para indicar que es modo creación */}
          </div>
        </main>
      </div>
    </div>
  );
} 