import { NavLink } from 'react-router-dom';
import { Factory, ChartBar, LayoutDashboard, Package, Printer, Users } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-blue-600">Gráfica DTF</h1>
      </div>
      <div className="flex flex-col flex-1 p-4 space-y-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
              isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink
          to="/crm"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
              isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Users className="w-5 h-5 mr-3" />
          Clientes
        </NavLink>
        <NavLink
          to="/erp"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
              isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Package className="w-5 h-5 mr-3" />
          Insumos
        </NavLink>
        <NavLink
          to="/mrp"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
              isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Printer className="w-5 h-5 mr-3" />
          Pedidos
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
              isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <ChartBar className="w-5 h-5 mr-3" />
          Relatórios
        </NavLink>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Admin</p>
            <p className="text-xs text-gray-500">admin@grafica.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
