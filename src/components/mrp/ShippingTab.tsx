import { useState } from 'react';
import { Check, Printer, QrCode, Search, Truck } from 'lucide-react';
import { useData, PrintOrder } from '../../context/DataContext';

const ShippingTab = () => {
  const { printOrders, customers, tubeModels, shipOrder, printShippingLabel } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Get only orders that are completed but not yet shipped
  const completedOrders = printOrders.filter(order => 
    order.status === 'expedição'
  );

  // Get orders that have been shipped
  const shippedOrders = printOrders.filter(order => 
    order.status === 'entregue'
  );

  const getCustomerName = (customerId: string): string => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Cliente não encontrado';
  };

  const getTubeModelName = (tubeModelId: string): string => {
    const model = tubeModels.find(m => m.id === tubeModelId);
    return model ? `${model.name} (${model.size})` : 'Modelo não encontrado';
  };

  const handleShipOrder = (orderId: string) => {
    if (window.confirm('Confirmar envio deste pedido?')) {
      shipOrder(orderId);
    }
  };

  const handlePrintLabel = (orderId: string) => {
    printShippingLabel(orderId);
  };

  const filteredCompletedOrders = completedOrders.filter(order => {
    const customerName = getCustomerName(order.customerId).toLowerCase();
    return customerName.includes(searchTerm.toLowerCase()) || 
           (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const filteredShippedOrders = shippedOrders.filter(order => {
    const customerName = getCustomerName(order.customerId).toLowerCase();
    return customerName.includes(searchTerm.toLowerCase()) || 
           (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div>
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

      <div className="space-y-8">
        {/* Pedidos Concluídos */}
        <div>
          <h2 className="text-xl font-medium text-gray-800 mb-4">Pedidos Prontos para Envio</h2>
          <div className="card">
            <div className="table-container">
              <table className="table">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col">Pedido</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Produto</th>
                    <th scope="col">Quantidade</th>
                    <th scope="col">Tubete</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCompletedOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="font-medium text-gray-900">{order.orderNumber}</td>
                      <td>{getCustomerName(order.customerId)}</td>
                      <td>{order.productId}</td>
                      <td>{order.quantity}</td>
                      <td>{getTubeModelName(order.tubeModelId)}</td>
                      <td className="flex space-x-2">
                        <button 
                          className="btn btn-secondary flex items-center py-1 px-2 text-sm"
                          onClick={() => handlePrintLabel(order.id)}
                        >
                          <Printer className="w-4 h-4 mr-1" />
                          Imprimir Etiqueta
                        </button>
                        <button 
                          className="btn btn-primary flex items-center py-1 px-2 text-sm"
                          onClick={() => handleShipOrder(order.id)}
                        >
                          <Truck className="w-4 h-4 mr-1" />
                          Enviar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredCompletedOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-gray-500">
                        Nenhum pedido pronto para envio
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pedidos Enviados */}
        <div>
          <h2 className="text-xl font-medium text-gray-800 mb-4">Pedidos Enviados</h2>
          <div className="card">
            <div className="table-container">
              <table className="table">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col">Pedido</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Produto</th>
                    <th scope="col">Quantidade</th>
                    <th scope="col">Data de Envio</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredShippedOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="font-medium text-gray-900">{order.orderNumber}</td>
                      <td>{getCustomerName(order.customerId)}</td>
                      <td>{order.productId}</td>
                      <td>{order.quantity}</td>
                      <td>{new Date(order.updatedAt).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <button 
                          className="btn btn-secondary flex items-center py-1 px-2 text-sm"
                          onClick={() => handlePrintLabel(order.id)}
                        >
                          <Printer className="w-4 h-4 mr-1" />
                          Reimprimir Etiqueta
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredShippedOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-gray-500">
                        Nenhum pedido enviado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingTab;
