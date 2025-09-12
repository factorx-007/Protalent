'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  FiGrid, FiUsers, FiBriefcase, FiFileText, 
  FiMessageSquare, FiTag, FiEdit3, FiActivity, FiSettings
} from 'react-icons/fi';

const adminNavItems = [
  { name: 'Resumen', href: '/admin', icon: FiGrid },
  { name: 'Usuarios', href: '/admin/usuarios', icon: FiUsers },
  { name: 'Empresas', href: '/admin/empresas', icon: FiBriefcase },
  { name: 'Ofertas', href: '/admin/ofertas', icon: FiFileText },
  { name: 'Postulaciones', href: '/admin/postulaciones', icon: FiActivity },
  { name: 'Categorías', href: '/admin/categorias', icon: FiTag },
  { name: 'Comentarios', href: '/admin/comentarios', icon: FiMessageSquare }, // Asumiendo modelo Comentario
  { name: 'Blog Posts', href: '/admin/blogposts', icon: FiEdit3 }, // Asumiendo modelo BlogPost
  // Podríamos añadir un item de Configuración general del sitio si es necesario
  // { name: 'Configuración', href: '/admin/configuracion', icon: FiSettings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const navHeight = 68; // Altura aproximada del AdminNavbar (ajustar si es necesario)

  return (
    <aside 
      className="w-64 h-screen bg-gray-800 text-gray-300 flex flex-col shadow-2xl fixed left-0 top-0 z-40"
      style={{ paddingTop: `${navHeight}px` }} // Para que comience debajo del AdminNavbar
    >
      <div className="p-5 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white text-center">Menú Admin</h2>
      </div>
      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        {adminNavItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 ease-in-out group
              ${pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin')
                ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg scale-[1.02]'
                : 'hover:bg-gray-700 hover:text-sky-300 hover:shadow-md'
              }`}
          >
            <item.icon 
              className={`w-5 h-5 mr-3 transition-colors duration-200 
              ${pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin') ? 'text-white' : 'text-gray-400 group-hover:text-sky-300'}`}
            />
            <span className="font-medium text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700 mt-auto">
        <p className="text-xs text-gray-500 text-center">&copy; {new Date().getFullYear()} ProTalent Admin</p>
      </div>
    </aside>
  );
} 