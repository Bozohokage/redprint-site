import { useState } from 'react';
import { Eye, FileCheck, FilePlus, FileX, Package, Search, Trash2 } from 'lucide-react';
import { useData, PrintOrder } from '../../context/DataContext';
import PrintOrderModal from './PrintOrderModal';

interface OrdersTabProps {
  searchTerm?: string;
}

const OrdersTab = ({ searchTerm = '' }: OrdersTabProps) => {
  const { printOrders, customers, products, sellers, addPrintOrder, updatePrintOrder, deletePrintOrder, openOrderFolder } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [currentOrder, setCurrentOrder] = useState<PrintOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleAddClick = () => {
    setCurrentOrder(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (order: PrintOrder) => {
    setCurrentOrder(order);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      deletePrintOrder(id);
    }
  };

  const handleSaveOrder = (order: PrintOrder | Omit<PrintOrder, 'id' | 'orderNumber'>) => {
    if ('id' in order) {
      updatePrintOrder(order);
    } else {
      addPrintOrder(order);
    }
    setIsModalOpen(false);
  };

  const handleRowClick = (orderNumber: string) => {
    openOrderFolder(orderNumber);
  };

  const getCustomerName = (customerId: string | undefined): string => {
    if (!customerId) return 'Cliente não encontrado';
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Cliente não encontrado';
  };

  const getSellerName = (sellerId: string | undefined): string => {
    if (!sellerId) return 'Vendedor não encontrado';
    const seller = sellers.find(s => s.id === sellerId);
    return seller ? seller.name : 'Vendedor não encontrado';
  };
  
  const getProductName = (productId: string | undefined): string => {
    if (!productId) return 'Produto não encontrado';
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Produto não encontrado';
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'analise':
        return 'bg-yellow-100 text-yellow-800';
      case 'aprovado':
        return 'bg-blue-100 text-blue-800';
      case 'producao':
        return 'bg-orange-100 text-orange-800';
      case 'expedição':
        return 'bg-purple-100 text-purple-800';
      case 'entregue':
        return 'bg-green-100 text-green-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'analise': return 'Análise dos Arquivos';
      case 'aprovado': return 'Arquivos Aprovados';
      case 'producao': return 'Em Produção';
      case 'expedição': return 'Expedição';
      case 'entregue': return 'Entregue';
      case 'rejeitado': return 'Rejeitado';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'analise': return <FileCheck className="w-4 h-4 mr-1" />;
      case 'aprovado': return <FileCheck className="w-4 h-4 mr-1" />;
      case 'producao': return <Package className="w-4 h-4 mr-1" />;
      case 'expedição': return <Package className="w-4 h-4 mr-1" />;
      case 'entregue': return <FileCheck className="w-4 h-4 mr-1" />;
      case 'rejeitado': return <FileX className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    return status === 'pago' 
      ? <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Pago</span>
      : <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Pendente</span>;
  };

  // Apply all filters - with safety checks to prevent lowercase errors
  const effectiveSearchTerm = searchTerm || localSearchTerm;
  const filteredOrders = printOrders.filter(order => {
    // Status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // If no search term, include all orders that passed the status filter
    if (!effectiveSearchTerm) {
      return true;
    }
    
    // Search term filter - with null checks
    const customerName = getCustomerName(order.customerId).toLowerCase();
    const orderNumber = (order.orderNumber || '').toLowerCase();
    const productName = getProductName(order.productId).toLowerCase();
    const searchTermLower = effectiveSearchTerm.toLowerCase();
    
    return customerName.includes(searchTermLower) || 
           orderNumber.includes(searchTermLower) ||
           productName.includes(searchTermLower);
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <h2 className="text-xl font-medium text-gray-800">Todos os Pedidos</h2>
          <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
            {filteredOrders.length} pedidos
          </span>
        </div>
        
        <div className="flex gap-2">
          <select 
            className="input py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos os status</option>
            <option value="analise">Análise</option>
            <option value="aprovado">Aprovado</option>
            <option value="producao">Em Produção</option>
            <option value="expedição">Expedição</option>
            <option value="entregue">Entregue</option>
            <option value="rejeitado">Rejeitado</option>
          </select>
          
          <button 
            className="btn btn-primary flex items-center" 
            onClick={handleAddClick}
          >
            <FilePlus className="w-4 h-4 mr-2" />
            Novo Pedido
          </button>
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
              placeholder="Buscar pedidos..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagamento</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onDoubleClick={() => handleRowClick(order.orderNumber)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{order.orderNumber || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getCustomerName(order.customerId)}</div>
                    <div className="text-xs text-gray-500">Vendedor: {getSellerName(order.sellerId)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.createdAt || 'N/A'}</div>
                    <div className="text-xs text-gray-500">Entrega: {order.deliveryDate || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getProductName(order.productId)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      R$ {(order.totalValue || 0).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status || '')}`}>
                      {getStatusIcon(order.status || '')}
                      {getStatusText(order.status || '')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentStatusBadge(order.paymentStatus || '')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-1">
                      <button
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(order);
                        }}
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(order.id);
                        }}
                        title="Excluir pedido"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <FilePlus className="w-12 h-12 text-gray-300 mb-2" />
                      <p>Nenhum pedido encontrado</p>
                      <button 
                        className="btn btn-primary mt-4" 
                        onClick={handleAddClick}
                      >
                        Criar novo pedido
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <PrintOrderModal
          order={currentOrder}
          customers={customers}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveOrder}
        />
      )}
    </div>
  );
};

export default OrdersTab;
