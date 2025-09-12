'use client';
import { FiPlusCircle, FiBarChart2, FiFilter, FiList, FiPieChart } from 'react-icons/fi';

const PlaceholderTable = ({ title, columns = ["ID", "Nombre", "Email", "Rol", "Acciones"] }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 mt-8">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <div className="flex items-center gap-2">
        <button className="text-sm text-gray-600 hover:text-sky-600 flex items-center gap-1 p-2 rounded-md hover:bg-gray-100 transition-colors">
          <FiFilter className="w-4 h-4"/> Filtros
        </button>
        <button className="text-sm text-gray-600 hover:text-sky-600 flex items-center gap-1 p-2 rounded-md hover:bg-gray-100 transition-colors">
          <FiList className="w-4 h-4"/> Opciones
        </button>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              <th key={col} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => ( // 5 filas de datos ficticios
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              {columns.map(col => (
                <td key={`${i}-${col}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Dato Ficticio {col} {i+1}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-4 flex justify-between items-center">
      <p className="text-sm text-gray-500">Mostrando 1-5 de X resultados</p>
      {/* Placeholder para Paginación */}
      <div className="flex gap-1">
        <button className="p-2 text-xs rounded-md bg-gray-200 hover:bg-gray-300">&lt;</button>
        <button className="p-2 text-xs rounded-md bg-sky-500 text-white">1</button>
        <button className="p-2 text-xs rounded-md bg-gray-200 hover:bg-gray-300">2</button>
        <button className="p-2 text-xs rounded-md bg-gray-200 hover:bg-gray-300">&gt;</button>
      </div>
    </div>
  </div>
);


export default function AdminSectionPage({
  title,
  metrics = [], 
  charts = [],  
  mainTableTitle,
  mainTableColumns,
  showNewButton = true,
  newButtonText = "Añadir Nuevo",
  onNewButtonClick = () => console.log("Nuevo item clickeado"),
}) {
  
  const MetricCard = ({ title, value, icon, color, trend, unit = '' }) => {
    const IconComponent = icon;
    return (
      <div className={`bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${color || 'border-sky-500'}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-md font-semibold text-gray-600">{title}</h3>
          {IconComponent && <IconComponent className={`w-7 h-7 ${color ? color.replace('border-', 'text-').replace('text-','text-') : 'text-sky-500'}`} />}
        </div>
        <p className="text-3xl font-bold text-gray-800">{value}{unit}</p>
        {trend && (
          <p className={`text-xs mt-1 flex items-center ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
             {trend}
          </p>
        )}
      </div>
    );
  };

  const PlaceholderChart = ({ title, type }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="flex items-center justify-center h-56 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        {type === 'bar' && <FiBarChart2 className="w-12 h-12 text-gray-300" />}
        {type === 'pie' && <FiPieChart className="w-12 h-12 text-gray-300" />}
        <p className="ml-3 text-gray-400 text-sm">Gráfica ({type})</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        {showNewButton && (
          <button
            onClick={onNewButtonClick}
            className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <FiPlusCircle className="w-5 h-5" /> {newButtonText}
          </button>
        )}
      </div>

      {metrics.length > 0 && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(metrics.length, 4)} gap-5 mb-8`}>
          {metrics.map(metric => <MetricCard key={metric.title} {...metric} />)}
        </div>
      )}

      {charts.length > 0 && (
        <div className={`grid grid-cols-1 lg:grid-cols-${Math.min(charts.length, 2)} gap-8 mb-8`}>
          {charts.map(chart => <PlaceholderChart key={chart.title} {...chart} />)}
        </div>
      )}

      {mainTableTitle && (
        <PlaceholderTable title={mainTableTitle} columns={mainTableColumns} />
      )}
    </div>
  );
} 