import { useState } from 'react';
import { Check, FileSearch, MessageSquare, Search, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface FilesAnalysisTabProps {
  searchTerm?: string;
}

const FilesAnalysisTab = ({ searchTerm = '' }: FilesAnalysisTabProps) => {
  const { printOrders, customers, products, sellers, approveOrderFiles, rejectOrderFiles, openOrderFolder } = useData();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [showRejectInput, setShowRejectInput] = useState<Record<string, boolean>>({});

  // Filter orders in analysis status
  const ordersInAnalysis = printOrders.filter(order => order.status === 'analise');

  const getCustomerName = (customerId: string): string => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Cliente não encontrado';
  };

  const getSellerName = (sellerId: string): string => {
    const seller = sellers.find(s => s.id === sellerId);
    return seller ? seller.name : 'Vendedor não encontrado';
  };
  
  const getProductName = (productId: string): string => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Produto não encontrado';
  };

  const handleApprove = (orderId: string) => {
    if (window.confirm('Confirmar aprovação dos arquivos deste pedido?')) {
      approveOrderFiles(orderId);
    }
  };

  const handleShowRejectInput = (orderId: string) => {
    setShowRejectInput({
      ...showRejectInput,
      [orderId]: true
    });
    setRejectReason({
      ...rejectReason,
      [orderId]: ''
    });
  };

  const handleReject = (orderId: string) => {
    const reason = rejectReason[orderId] || 'Sem motivo especificado';
    if (window.confirm(`Rejeitar os arquivos deste pedido?\nMotivo: ${reason}`)) {
      rejectOrderFiles(orderId);
      setShowRejectInput({
        ...showRejectInput,
        [orderId]: false
      });
    }
  };

  const handleCancelReject = (orderId: string) => {
    setShowRejectInput({
      ...showRejectInput,
      [orderId]: false
    });
  };

  const handleRowClick = (orderNumber: string) => {
    openOrderFolder(orderNumber);
  };

  const effectiveSearchTerm = searchTerm || localSearchTerm;
  const filteredOrders = ordersInAnalysis.filter(order => {
    if (!effectiveSearchTerm) return true;
    
    const customerName = getCustomerName(order.customerId || '').toLowerCase();
    const orderNumber = (order.orderNumber || '').toLowerCase();
    const productName = getProductName(order.productId || '').toLowerCase();
    const searchTermLower = effectiveSearchTerm.toLowerCase();
    
    return customerName.includes(searchTermLower) || 
           orderNumber.includes(searchTermLower) ||
           productName.includes(searchTermLower);
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-medium text-gray-800">Análise dos Arquivos</h2>
          <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
            {filteredOrders.length} pedidos
          </span>
        </div>
      </div>

      {searchTerm === '' && (
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Buscar pedidos em análise..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="card">
        {filteredOrders.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {filteredOrders.map((order) => (
              <div 
                key={order.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div 
                  className="bg-yellow-50 border-b p-4 flex justify-between items-center cursor-pointer"
                  onClick={() => handleRowClick(order.orderNumber)}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">{getCustomerName(order.customerId)}</p>
                  </div>
                  <FileSearch className="h-6 w-6 text-yellow-600" />
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Data</p>
                      <p className="text-sm">{order.createdAt} às {order.createdTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Produto</p>
                      <p className="text-sm">{getProductName(order.productId)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Quantidade</p>
                      <p className="text-sm">{order.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Entrega</p>
                      <p className="text-sm">{order.deliveryDate}</p>
                    </div>
                  </div>
                  
                  {order.notes && (
                    <div className="mb-4 p-2 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-500">Observações:</p>
                      <p className="text-sm">{order.notes}</p>
                    </div>
                  )}
                  
                  {showRejectInput[order.id] ? (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Motivo da rejeição:</p>
                      <textarea
                        className="input w-full text-sm"
                        rows={2}
                        placeholder="Descreva o motivo da rejeição"
                        value={rejectReason[order.id] || ''}
                        onChange={(e) => setRejectReason({
                          ...rejectReason,
                          [order.id]: e.target.value
                        })}
                      />
                      <div className="flex justify-end mt-2 space-x-2">
                        <button
                          className="btn btn-secondary text-sm py-1"
                          onClick={() => handleCancelReject(order.id)}
                        >
                          Cancelar
                        </button>
                        <button
                          className="btn bg-red-600 text-white hover:bg-red-700 text-sm py-1"
                          onClick={() => handleReject(order.id)}
                        >
                          Confirmar Rejeição
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <button
                        className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                        onClick={() => handleApprove(order.id)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Aprovar
                      </button>
                      <button
                        className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                        onClick={() => handleShowRejectInput(order.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Rejeitar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileSearch className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhum pedido aguardando análise</h3>
            <p className="text-gray-500">Todos os arquivos foram analisados pela equipe.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesAnalysisTab;
