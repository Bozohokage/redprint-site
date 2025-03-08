import { ChartBar, Package, ShoppingCart, Squircle, TrendingUp, Users } from 'lucide-react';
import { useData } from '../context/DataContext';

const Dashboard = () => {
  const { customers, supplies, tubeModels, printOrders } = useData();

  // Calculate some basic stats
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const lowStockSupplies = supplies.filter(s => s.quantity <= s.reorderPoint).length;
  const lowStockTubeModels = tubeModels.filter(t => t.quantity <= t.reorderPoint).length;
  const ordersInProduction = printOrders.filter(o => o.status === 'produção').length;

  return (
    <div className="container mx-auto">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* CRM Stats */}
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Clientes Ativos</p>
                <p className="text-2xl font-semibold text-gray-800">{activeCustomers}</p>
              </div>
            </div>
          </div>

          {/* ERP Stats */}
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Package className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Insumos</p>
                <p className="text-2xl font-semibold text-gray-800">{supplies.length}</p>
              </div>
            </div>
          </div>

          {/* MRP Stats */}
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <ChartBar className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pedidos em Produção</p>
                <p className="text-2xl font-semibold text-gray-800">{ordersInProduction}</p>
              </div>
            </div>
          </div>

          {/* Revenue Stats (Placeholder) */}
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Receita (Mês)</p>
                <p className="text-2xl font-semibold text-gray-800">R$ 58.950</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts Section */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Alertas</h2>
            <div className="space-y-4">
              {lowStockSupplies > 0 && (
                <div className="flex items-center p-3 bg-red-50 text-red-700 rounded-md">
                  <Squircle className="h-5 w-5 mr-2" />
                  <span>{lowStockSupplies} insumos com estoque baixo</span>
                </div>
              )}
              
              {lowStockTubeModels > 0 && (
                <div className="flex items-center p-3 bg-orange-50 text-orange-700 rounded-md">
                  <Squircle className="h-5 w-5 mr-2" />
                  <span>{lowStockTubeModels} tubetes abaixo do ponto de reposição</span>
                </div>
              )}
              
              {/* Example alert */}
              <div className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-md">
                <Squircle className="h-5 w-5 mr-2" />
                <span>5 contatos de clientes pendentes</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Atividade Recente</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Novo cliente adicionado</p>
                  <p className="text-xs text-gray-500">Hoje, 10:45</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full">
                  <ShoppingCart className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Novo pedido de impressão</p>
                  <p className="text-xs text-gray-500">Ontem, 15:30</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Package className="h-4 w-4 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Reposição de insumos realizada</p>
                  <p className="text-xs text-gray-500">Ontem, 08:15</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
