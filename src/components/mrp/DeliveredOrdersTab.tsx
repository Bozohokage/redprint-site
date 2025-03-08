import { useState } from 'react';
import { FileCheck, Printer, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';

const DeliveredOrdersTab = () => {
  const { printOrders, customers, products, sellers } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter orders with status "entregue" (delivered)
  const deliveredOrders = printOrders.filter(order => order.status === 'entregue');

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

  const handlePrintInvoice = (orderId: string) => {
    const order = printOrders.find(o => o.id === orderId);
    if (!order) return;
    
    // This would typically open a print dialog with the invoice
    alert(`Simulando impressão da nota fiscal para o pedido: ${order.orderNumber}`);
  };

  const filteredOrders = deliveredOrders.filter(order => {
    const customerName = getCustomerName(order.customerId).toLowerCase();
    const orderNumber = order.orderNumber.toLowerCase();
    const productName = getProductName(order.productId).toLowerCase();
    
    return customerName.includes(searchTerm.toLowerCase()) || 
           orderNumber.includes(searchTerm.toLowerCase()) ||
           productName.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-800">Pedidos Entregues</h2>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Buscar pedidos entregues..."
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
                <th scope="col">Número</th>
                <th scope="col">Cliente</th>
                <th scope="col">Data de Entrega</th>
                <th scope="col">Produto</th>
                <th scope="col">Quantidade</th>
                <th scope="col">Vendedor</th>
                <th scope="col">Valor Total</th>
                <th scope="col">Pagamento</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="font-medium text-gray-900">{order.orderNumber}</td>
                  <td>{getCustomerName(order.customerId)}</td>
                  <td>{new Date(order.updatedAt).toLocaleDateString('pt-BR')}</td>
                  <td>{getProductName(order.productId)}</td>
                  <td>{order.quantity}</td>
                  <td>{getSellerName(order.sellerId)}</td>
                  <td>R$ {order.totalValue.toFixed(2)}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.paymentStatus === 'pago' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.paymentStatus === 'pago' ? 'Pago' : 'Pendente'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="text-blue-600 hover:text-blue-800 p-1"
                      onClick={() => handlePrintInvoice(order.id)}
                      title="Imprimir nota fiscal"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    Nenhum pedido entregue encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveredOrdersTab;
