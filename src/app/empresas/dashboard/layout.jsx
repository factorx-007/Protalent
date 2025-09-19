'use client';

import { Inter } from 'next/font/google';
import '../../../app/globals.css';
import { AuthProvider } from '../../../app/context/auth/AuthContext';
import EmpresasNavbar from '../../../app/components/views/EmpresasNavbar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default function EmpresasDashboardLayout({ children }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <EmpresasNavbar />
        <main className="flex-1 pt-24">
          {children}
        </main>
      </div>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
