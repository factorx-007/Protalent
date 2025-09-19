// Datos de ejemplo para el dashboard de empresas
export const dashboardStats = {
  totalOfertas: 24,
  ofertasActivas: 8,
  postulacionesTotales: 156,
  postulacionesNuevas: 12,
  tasaContratacion: 0.18, // 18%
  tiempoPromedioContratacion: 14, // días
};

export const postulacionesPorMes = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
  datasets: [
    {
      label: 'Postulaciones',
      data: [45, 32, 28, 51, 42, 79, 65, 88, 72],
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
      tension: 0.3,
      fill: true,
    },
  ],
};

export const ofertasRecientes = [
  {
    id: 1,
    titulo: 'Desarrollador Frontend Senior',
    fecha: '2025-09-15',
    postulaciones: 24,
    estado: 'Activa',
    tipo: 'Tiempo completo',
  },
  {
    id: 2,
    titulo: 'Diseñador UX/UI',
    fecha: '2025-09-10',
    postulaciones: 18,
    estado: 'Activa',
    tipo: 'Medio tiempo',
  },
  {
    id: 3,
    titulo: 'Product Manager',
    fecha: '2025-08-28',
    postulaciones: 15,
    estado: 'Cerrada',
    tipo: 'Tiempo completo',
  },
];

export const actividadReciente = [
  {
    id: 1,
    tipo: 'nueva_postulacion',
    mensaje: 'Nueva postulación para Desarrollador Frontend',
    fecha: '2025-09-18T10:30:00',
    leido: false,
  },
  {
    id: 2,
    tipo: 'cambio_estado',
    mensaje: 'Cambio de estado en postulación #4582 a "En revisión"',
    fecha: '2025-09-17T15:45:00',
    leido: true,
  },
  {
    id: 3,
    tipo: 'nuevo_candidato',
    mensaje: 'Nuevo candidato calificado para Diseñador UX/UI',
    fecha: '2025-09-16T09:15:00',
    leido: true,
  },
];
