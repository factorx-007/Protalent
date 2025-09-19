'use client';

import { useState, useEffect, Fragment } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import { FiLogOut, FiUser, FiChevronDown, FiMenu, FiX, FiBriefcase, FiUsers, FiPieChart, FiFileText, FiHome } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../context/auth/AuthContext';

// Ítems de navegación con iconos y rutas
const navItems = [
  { 
    name: 'Inicio', 
    path: '/empresas/dashboard', 
    icon: <FiHome className="w-5 h-5" />,
    activeIcon: <FiHome className="w-5 h-5 text-blue-600" />
  },
  { 
    name: 'Ofertas', 
    path: '/empresas/dashboard/ofertas', 
    icon: <FiBriefcase className="w-5 h-5" />,
    activeIcon: <FiBriefcase className="w-5 h-5 text-blue-600" />
  },
  { 
    name: 'Postulaciones', 
    path: '/empresas/dashboard/postulaciones', 
    icon: <FiFileText className="w-5 h-5" />,
    activeIcon: <FiFileText className="w-5 h-5 text-blue-600" />
  },
  { 
    name: 'Análisis', 
    path: '/empresas/dashboard/analiticas', 
    icon: <FiPieChart className="w-5 h-5" />,
    activeIcon: <FiPieChart className="w-5 h-5 text-blue-600" />
  },
];

export default function EmpresasNavbar() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-gray-100 py-2' 
          : 'bg-white/90 backdrop-blur-sm border-transparent py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/empresas/dashboard" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 relative transition-transform group-hover:scale-105">
              <Image 
                src="/logo.jpg" 
                alt="ProTalent Empresas" 
                fill 
                className="rounded-lg object-cover shadow-sm"
                priority
                sizes="(max-width: 768px) 2.25rem, 2.25rem"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ProTalent <span className="hidden sm:inline">Empresas</span>
            </span>
          </Link>

          {/* Navegación de escritorio */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path || 
                             (item.path !== '/empresas/dashboard' && 
                              pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center group ${
                    isActive
                      ? 'text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">
                    {isActive ? item.activeIcon : item.icon}
                  </span>
                  {item.name}
                  {isActive && (
                    <motion.span 
                      className="absolute bottom-0 left-1/2 w-4/5 h-0.5 bg-blue-600 -translate-x-1/2 rounded-full"
                      layoutId="activeNavItem"
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 24
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 focus:outline-none">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.nombre || 'Empresa'}
                </span>
                <FiChevronDown className="w-4 h-4 text-gray-500" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => router.push('/empresas/dashboard/perfil')}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <FiUser className="mr-3 h-5 w-5 text-gray-400" />
                        Perfil
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex w-full items-center px-4 py-2 text-sm text-red-600`}
                      >
                        <FiLogOut className="mr-3 h-5 w-5 text-red-400" />
                        Cerrar sesión
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    pathname === item.path
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 my-2"></div>
              <button
                onClick={() => {
                  router.push('/empresas/dashboard/perfil');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                <FiUser className="mr-3 h-5 w-5" />
                Perfil
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                <FiLogOut className="mr-3 h-5 w-5" />
                Cerrar sesión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
