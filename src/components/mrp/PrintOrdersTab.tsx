import { useState } from 'react';
import { FilePlus, Pencil, Printer, Search, Trash2 } from 'lucide-react';
import { useData, PrintOrder } from '../../context/DataContext';
import PrintOrderModal from './PrintOrderModal';

const PrintOrdersTab = () => {
  const { printOrders, customers, addPrintOrder, updatePrintOrder, deletePrintOrder } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentOrder, setCurrentOrder] = useState<PrintOrder | null>(null);

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

  const handleSaveOrder = (order: PrintOrder | Omit<PrintOrder, 'id'>) => {
    if ('id' in order) {
      updatePrintOrder(order);
    } else {
      addPrintOrder(order);
    }
    setIsModalOpen(false);
  };

  const getCustomerName = (customerId: string): string => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Cliente não encontrado';
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'análise':
        return 'bg-yellow-100 text-yellow-800';
      case 'aguardando':
        return 'bg-blue-100 text-blue-800';
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'pago':
        return 'bg-purple-100 text-purple-800';
      case 'produção':
        return 'bg-orange-100 text-orange-800';
      case 'concluído':
        return 'bg-emerald-100 text-emerald-800';
      case 'enviado':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    return status === 'pago' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const filteredOrders = printOrders.filter(order => {
    const customerName = getCustomerName(order.customerId).toLowerCase();
    return customerName.includes(searchTerm.toLowerCase()) || 
           order.fileName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Filter orders that are not in production or later stages
  const pendingOrders = filteredOrders.filter(order => 
    ['análise', 'aguardando', 'aprovado', 'pago'].includes(order.status)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-800">Pedidos de Impressão</h2>
        <button 
          className="btn btn-primary flex items-center" 
          onClick={handleAddClick}
        >
          <FilePlus className="w-4 h-4 mr-2" />
          Novo Pedido
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Buscar pedidos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col">Cliente</th>
                <th scope="col">Arquivo</th>
                <th scope="col">Metros</th>
                <th scope="col">Data</th>
                <th scope="col">Status</th>
                <th scope="col">Pagamento</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingOrders.map((order) => (
                <tr key={order.id}>
                  <td className="font-medium text-gray-900">{getCustomerName(order.customerId)}</td>
                  <td>{order.fileName}</td>
                  <td>{order.finalMeters} m</td>
                  <td>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                      {order.paymentStatus === 'pago' ? 'Pago' : 'Pendente'}
                    </span>
                  </td>
                  <td className="flex space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditClick(order)}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteClick(order.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {pendingOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    Nenhum pedido pendente encontrado
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

export default PrintOrdersTab;
