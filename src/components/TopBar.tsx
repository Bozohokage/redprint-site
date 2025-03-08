import { Bell, Menu, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center flex-1">
            <button
              type="button"
              className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <span className="sr-only">Abrir menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="max-w-xs w-full hidden sm:block">
              <div className="relative text-gray-400 focus-within:text-gray-600">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Buscar"
                  type="search"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
              <span className="sr-only">Ver notificações</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="ml-3 relative">
              <div className="md:hidden">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  U
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on mobile menu state */}
      {showMobileMenu && (
        <div className="md:hidden border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
                setShowMobileMenu(false);
              }}
            >
              Dashboard
            </a>
            <a
              href="/crm"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
              onClick={(e) => {
                e.preventDefault();
                navigate('/crm');
                setShowMobileMenu(false);
              }}
            >
              Clientes
            </a>
            <a
              href="/erp"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
              onClick={(e) => {
                e.preventDefault();
                navigate('/erp');
                setShowMobileMenu(false);
              }}
            >
              Insumos
            </a>
            <a
              href="/mrp"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
              onClick={(e) => {
                e.preventDefault();
                navigate('/mrp');
                setShowMobileMenu(false);
              }}
            >
              Pedidos
            </a>
            <a
              href="/reports"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
              onClick={(e) => {
                e.preventDefault();
                navigate('/reports');
                setShowMobileMenu(false);
              }}
            >
              Relatórios
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;
