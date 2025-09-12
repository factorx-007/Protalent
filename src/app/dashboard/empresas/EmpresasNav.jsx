'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard/empresas', label: 'Ver Empresas' },
  { href: '/dashboard/empresas/crear', label: 'Crear Empresa' },
];

export default function EmpresasNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-2 mb-8">
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-5 py-2 rounded-lg font-medium transition-colors shadow-sm
            ${pathname === item.href
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'}
          `}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
} 