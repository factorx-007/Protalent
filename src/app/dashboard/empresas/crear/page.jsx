'use client';

import EmpresaForm from '../../../components/empresa/EmpresaForm';
import EmpresasNav from '../EmpresasNav';

export default function CrearEmpresaPage() {
  return (
    <div className="py-8 max-w-4xl mx-auto">
      <EmpresasNav />
      <div className="bg-white rounded-lg shadow p-8">
      <EmpresaForm />
      </div>
    </div>
  );
}
