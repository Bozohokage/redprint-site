import { useState } from 'react';
import { Box, CircleCheck, Clock, FileCheck, Package, Printer, Search, Timer } from 'lucide-react';
import { useData, PrintOrder, TubeModel } from '../../context/DataContext';

interface ProductionTabProps {
  searchTerm?: string;
}

const ProductionTab = ({ searchTerm = '' }: ProductionTabProps) => {
  const { printOrders, tubeModels, moveOrderToProduction, completeOrder, customers } = useData();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [selectedTubeModelId, setSelectedTubeModelId] = useState<string>('');
  const [selectedTubeQuantity, setSelectedTubeQuantity] = useState<number>(1);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Get only orders that are paid but not yet in production
  const pendingOrders = printOrders.filter(order => 
    order.status === 'pago' && order.paymentStatus === 'pago'
  );

  // Get orders that are currently in production
  const productionOrders = printOrders.filter(order => 
    order.status === 'producao'
  );

  const getCustomerName = (customerId: string): string => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Cliente não encontrado';
  };

  const handleMoveToProduction = (orderId: string) => {
    if (window.confirm('Mover este pedido para produção?')) {
      moveOrderToProduction(orderId);
    }
  };

  const handleCompleteProduction = (orderId: string) => {
    if (!selectedTubeModelId) {
      alert('Por favor, selecione um modelo de tubete para o envio');
      return;
    }
    
    if (window.confirm('Concluir a produção deste pedido?')) {
      completeOrder(orderId, selectedTubeModelId);
    }
  };

  const handleToggleExpand = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
      // Pre-select the first available tube model if none is selected
      if (!selectedTubeModelId && tubeModels.length > 0) {
        const firstAvailable = tubeModels.find(model => model.quantity > 0);
        if (firstAvailable) {
          setSelectedTubeModelId(firstAvailable.id);
        }
      }
    }
  };

  const effectiveSearchTerm = searchTerm || localSearchTerm;
  const filteredPendingOrders = pendingOrders.filter(order => {
    if (!effectiveSearchTerm) return true;
    
    const customerName = getCustomerName(order.customerId || '').toLowerCase();
    const orderNumber = (order.orderNumber || '').toLowerCase();
    const searchTermLower = effectiveSearchTerm.toLowerCase();
    
    return customerName.includes(searchTermLower) || 
           orderNumber.includes(searchTermLower);
  });

  const filteredProductionOrders = productionOrders.filter(order => {
    if (!effectiveSearchTerm) return true;
    
    const customerName = getCustomerName(order.customerId || '').toLowerCase();
    const orderNumber = (order.orderNumber || '').toLowerCase();
    const searchTermLower = effectiveSearchTerm.toLowerCase();
    
    return customerName.includes(searchTermLower) || 
           orderNumber.includes(searchTermLower);
  });

  // Calculate estimated progress for production orders (just for visualization)
  const getEstimatedProgress = (order: PrintOrder) => {
    const createdDate = new Date(order.createdAt).getTime();
    const now = new Date().getTime();
    const timePassed = now - createdDate;
    
    // Assume production takes 24 hours max
    const estimatedTotal = 24 * 60 * 60 * 1000;
    const progress = Math.min(100, Math.floor((timePassed / estimatedTotal) * 100));
    
    return progress;
  };

  return (
    <div className="space-y-8">
      {searchTerm === '' && (
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Buscar pedidos..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Pedidos Aprovados/Pagos */}
      <div>
        <div className="flex items-center mb-4">
          <Clock className="text-blue-600 h-5 w-5 mr-2" />
          <h2 className="text-xl font-medium text-gray-800">Pedidos Aguardando Produção</h2>
          <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
            {filteredPendingOrders.length} pedidos
          </span>
        </div>
        
        {filteredPendingOrders.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredPendingOrders.map((order) => (
              <div key={order.id} className="card hover:shadow-md transition-shadow">
                <div className="border-b pb-3 mb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-500">{getCustomerName(order.customerId)}</p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    Aguardando
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Produto:</span>
                    <span className="text-sm font-medium">{order.productId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Quantidade:</span>
                    <span className="text-sm font-medium">{order.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Entrega:</span>
                    <span className="text-sm font-medium">{order.deliveryDate}</span>
                  </div>
                </div>
                
                <button 
                  className="w-full btn btn-primary flex items-center justify-center" 
                  onClick={() => handleMoveToProduction(order.id)}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Iniciar Produção
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-8">
            <CircleCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhum pedido aguardando produção</h3>
            <p className="text-gray-500">Todos os pedidos já estão em produção ou foram concluídos.</p>
          </div>
        )}
      </div>

      {/* Pedidos Em Produção */}
      <div>
        <div className="flex items-center mb-4">
          <Printer className="text-orange-600 h-5 w-5 mr-2" />
          <h2 className="text-xl font-medium text-gray-800">Pedidos Em Produção</h2>
          <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
            {filteredProductionOrders.length} pedidos
          </span>
        </div>
        
        {tubeModels.length > 0 && filteredProductionOrders.length > 0 && (
          <div className="card p-4 mb-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Selecione o Tubete para Envio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tubeModels.map(model => (
                <div 
                  key={model.id} 
                  onClick={() => model.quantity > 0 && setSelectedTubeModelId(model.id)}
                  className={`border rounded-md p-3 cursor-pointer transition-all ${
                    selectedTubeModelId === model.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : model.quantity <= 0 
                        ? 'opacity-50 bg-gray-100 cursor-not-allowed' 
                        : 'hover:border-blue-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{model.name}</span>
                    {selectedTubeModelId === model.id && (
                      <CircleCheck className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{model.size}</div>
                  <div className="text-sm mt-1">
                    <span className={model.quantity <= model.reorderPoint ? 'text-red-600 font-medium' : ''}>
                      {model.quantity} disponíveis
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {filteredProductionOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredProductionOrders.map((order) => {
              const progress = getEstimatedProgress(order);
              
              return (
                <div key={order.id} className="card hover:shadow-md transition-shadow">
                  <div className="border-b pb-3 mb-3 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">{getCustomerName(order.customerId)}</p>
                    </div>
                    <button
                      onClick={() => handleToggleExpand(order.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedOrderId === order.id ? 'Minimizar' : 'Detalhes'}
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-gray-500">Progresso estimado:</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-orange-600 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {expandedOrderId === order.id && (
                    <div className="space-y-3 mb-4 bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Produto:</span>
                        <span className="text-sm font-medium">{order.productId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Quantidade:</span>
                        <span className="text-sm font-medium">{order.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Data de Pedido:</span>
                        <span className="text-sm font-medium">{order.createdAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Entrega Prevista:</span>
                        <span className="text-sm font-medium">{order.deliveryDate}</span>
                      </div>
                      {order.notes && (
                        <div>
                          <span className="text-sm text-gray-500">Observações:</span>
                          <p className="text-sm mt-1 bg-white p-2 rounded">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <button 
                    className={`w-full btn flex items-center justify-center ${
                      selectedTubeModelId ? 'btn-primary' : 'btn-secondary opacity-50'
                    }`}
                    onClick={() => handleCompleteProduction(order.id)}
                    disabled={!selectedTubeModelId}
                  >
                    <FileCheck className="w-4 h-4 mr-2" />
                    {selectedTubeModelId 
                      ? 'Concluir Produção' 
                      : 'Selecione um tubete para concluir'
                    }
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card text-center py-8">
            <Printer className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhum pedido em produção</h3>
            <p className="text-gray-500">No momento, não há pedidos sendo produzidos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionTab;
