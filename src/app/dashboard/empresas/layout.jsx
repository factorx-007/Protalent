'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function EmpresasLayout({ children }) {
  const pathname = usePathname();


  return (
    <div>
      {children}
    </div>
  );
}
