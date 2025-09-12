'use client';

import { useParams } from 'next/navigation';
import EmpresaForm from '../../../../components/empresa/EmpresaForm';
import EmpresasNav from '../../EmpresasNav';

export default function EditarEmpresaPage() {
  const params = useParams();
  const empresaId = params.id;

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <EmpresasNav />
      <div className="bg-white rounded-lg shadow p-8">
        <EmpresaForm empresaId={empresaId} />
      </div>
    </div>
  );
}
