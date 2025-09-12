'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

// Definición de íconos SVG (podrías moverlos a un archivo separado o usar una librería)
// Estos son tus SVGs originales, solo formateados para legibilidad.
const iconsMapping = {
  inicio: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  ),
  postulaciones: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  ),
  perfil: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  ),
  ofertas: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  ),
  empresas: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
  ),
  blog: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
  ),
};

const links = [
  { href: '/dashboard', label: 'Inicio', iconKey: 'inicio' },
  { href: '/dashboard/postulaciones', label: 'Mis Postulaciones', iconKey: 'postulaciones' },
  // { href: '/dashboard/perfil', label: 'Perfil', iconKey: 'perfil' }, // Comentado
  { href: '/dashboard/ofertas', label: 'Ofertas', iconKey: 'ofertas' },
  { href: '/dashboard/empresas', label: 'Empresas', iconKey: 'empresas' },
  { href: '/dashboard/blog', label: 'Blog', iconKey: 'blog' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-screen w-72 bg-white text-gray-800 flex flex-col shadow-xl border-r border-gray-200 sticky top-0">
      
      

      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map(link => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard');
          const iconElement = iconsMapping[link.iconKey] || <div className="w-6 h-6"></div>; // Fallback icon

          return (
            <li key={link.href} className="list-none">
              <Link 
                href={link.href} 
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-indigo-500 hover:text-white hover:shadow-lg active:scale-95
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl scale-105' 
                    : 'text-gray-600 hover:text-indigo-700' // Cambiado para mejor contraste en hover sobre blanco
                  }`}
              >
                <span className={`mr-4 transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                  {iconElement}
                </span>
                <span className={`font-medium text-sm transition-colors duration-200 ${isActive ? 'text-white' : 'group-hover:text-white'}`}>
                  {link.label}
                </span>
                {isActive && (
                    <span className="ml-auto w-2 h-2 bg-white rounded-full opacity-90 animate-pulse"></span>
                )}
              </Link>
            </li>
          );
        })}
      </nav>

      {/* Sección inferior del Sidebar */}
      <div className="p-5 border-t border-gray-200 mt-auto">
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <Image src="/logo.jpg" alt="ProTalent Mini Logo" width={32} height={32} className="rounded-full mr-3" />
            <div>
                <p className="text-xs font-semibold text-gray-700">ProTalent Platform</p>
                <p className="text-xs text-gray-500">© 2024</p>
            </div>
          </div>
          {/* Podrías agregar un botón de configuración o ayuda aquí */}
          {/* <button className="text-gray-400 hover:text-indigo-600"><CogIcon className="w-5 h-5" /></button> */}
        </div>
      </div>
    </aside>
  );
} 