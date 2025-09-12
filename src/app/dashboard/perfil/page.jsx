'use client';
import { useAuth } from '@/app/context/auth/AuthContext';
import Sidebar from '../../components/views/Sidebar';
import DashboardNavbar from '../../components/views/DashboardNavbar';

export default function PerfilPage() {
  const { user } = useAuth();

  if (!user) return <div>Cargando...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar />
      <div className="flex min-h-screen flex-1">
        <Sidebar />
        <main className="flex-1 p-10 bg-gray-50">
          <h1 className="text-3xl mb-6">Perfil de {user.nombre}</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.rol}</p>
            {/* Agregar más campos según necesidad */}
          </div>
        </main>
      </div>
    </div>
  );
}