'use client';

import Image from 'next/image';
import { useAuth } from '../../context/auth/AuthContext';
import { useState, useEffect, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FiLogOut, FiUser, FiEdit2, FiFileText, FiSettings, FiChevronDown, FiBriefcase } from 'react-icons/fi';
import Link from 'next/link';

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => setShowUserInfo(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowUserInfo(false);
    }
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  if (isLoggingOut) {
    return null;
  }

  const dashboardHomeLink = user?.rol?.toUpperCase() === 'EMPRESA' ? '/dashboard/empresas' : '/dashboard';

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-indigo-100 px-4 md:px-6 py-3 flex items-center justify-between shadow-xl sticky top-0 z-50">
      <div className="flex items-center gap-3 md:gap-4">
        <Link href={dashboardHomeLink} className="flex items-center gap-2 md:gap-3">
          <Image src="/logo.jpg" alt="Logo de ProTalent" width={40} height={40} priority className="rounded-lg shadow-md" />
          <span className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight hidden sm:inline">ProTalent</span>
        </Link>
        <span 
          className="text-xs bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full ml-1 md:ml-2 font-semibold shadow-md tracking-wider transform hover:scale-105 transition-transform duration-300"
        >
          DASHBOARD
        </span>
      </div>
      <div className="flex items-center gap-3 md:gap-5">
        {user && (
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button 
                className={`flex items-center gap-2 text-slate-700 text-sm p-2 rounded-lg hover:bg-indigo-50 transition-opacity duration-500 ease-in-out ${showUserInfo ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-sm border-2 border-white">
                  {user.nombre ? user.nombre.substring(0, 1).toUpperCase() : <FiUser />}
                </div>
                <span className="font-semibold text-indigo-700 hidden sm:inline">{user.nombre}</span>
                <FiChevronDown className="w-4 h-4 text-indigo-400 hidden sm:inline" aria-hidden="true" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="px-1 py-1 ">
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">{user.nombre}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <p className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-1 capitalize">{user.rol}</p>
                  </div>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => alert('Mostrar modal de perfil completo próximamente.')}
                        className={`${active ? 'bg-indigo-500 text-white' : 'text-gray-700'} group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium`}
                      >
                        <FiUser className="mr-2.5 h-5 w-5 text-indigo-400 group-hover:text-white" aria-hidden="true" />
                        Ver Mi Perfil
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                       <Link href="/dashboard/perfil/editar" className={`${active ? 'bg-indigo-500 text-white' : 'text-gray-700'} group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium`}>
                        <FiEdit2 className="mr-2.5 h-5 w-5 text-indigo-400 group-hover:text-white" aria-hidden="true" />
                        Editar Perfil
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  {user.rol?.toUpperCase() === 'CANDIDATO' && (
                    <Menu.Item>
                      {({ active }) => (
                        <Link href="/dashboard/postulaciones" className={`${active ? 'bg-indigo-500 text-white' : 'text-gray-700'} group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium`}>
                          <FiFileText className="mr-2.5 h-5 w-5 text-indigo-400 group-hover:text-white" aria-hidden="true" />
                          Mis Postulaciones
                        </Link>
                      )}
                    </Menu.Item>
                  )}
                   {user.rol?.toUpperCase() === 'EMPRESA' && (
                    <Menu.Item>
                      {({ active }) => (
                        <Link href="/dashboard/empresas/ofertas" className={`${active ? 'bg-indigo-500 text-white' : 'text-gray-700'} group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium`}>
                          <FiBriefcase className="mr-2.5 h-5 w-5 text-indigo-400 group-hover:text-white" aria-hidden="true" />
                          Gestionar Ofertas
                        </Link>
                      )}
                    </Menu.Item>
                  )}
                  <Menu.Item>
                    {({ active }) => (
                       <button
                        onClick={() => alert('Página de configuración próximamente.')}
                        className={`${active ? 'bg-indigo-500 text-white' : 'text-gray-700'} group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium`}
                      >
                        <FiSettings className="mr-2.5 h-5 w-5 text-indigo-400 group-hover:text-white" aria-hidden="true" />
                        Configuración
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${active ? 'bg-red-500 text-white' : 'text-gray-700'} group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium`}
                      >
                        <FiLogOut className="mr-2.5 h-5 w-5 text-red-400 group-hover:text-white" aria-hidden="true" />
                        Cerrar sesión
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
        {!user && !isLoggingOut && (
            <Link href="/auth/login" 
              className="px-4 py-2 rounded-lg text-sm font-semibold text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
              Login
            </Link>
        )}
      </div>
    </nav>
  );
} 