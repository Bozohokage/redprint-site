import { useState } from 'react';
import { Calendar, Download, FileSpreadsheet, FileText, Filter } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';

// Utility to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const ReportsPage = () => {
  const { printOrders, customers, supplies, tubeModels } = useData();
  const [dateRange, setDateRange] = useState<'7days' | '30days' | '90days' | 'all'>('30days');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isCustomDate, setIsCustomDate] = useState(false);

  // Helper function to filter data by date range
  const getFilteredData = <T extends { createdAt?: string; updatedAt?: string }>(
    data: T[],
    dateField: 'createdAt' | 'updatedAt' = 'createdAt'
  ): T[] => {
    const now = new Date();
    let filterDate = new Date();

    if (isCustomDate && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of the day
      
      return data.filter(item => {
        const itemDate = new Date(item[dateField] || '');
        return itemDate >= start && itemDate <= end;
      });
    }

    switch (dateRange) {
      case '7days':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        filterDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        filterDate.setDate(now.getDate() - 90);
        break;
      case 'all':
        return data;
    }

    return data.filter(item => {
      const itemDate = new Date(item[dateField] || '');
      return itemDate >= filterDate;
    });
  };

  // Get filtered orders
  const filteredOrders = getFilteredData(printOrders, 'updatedAt');
  
  // Completed orders (sales)
  const completedOrders = filteredOrders.filter(order => 
    ['concluído', 'enviado'].includes(order.status)
  );

  // Supply consumption calculation
  const calculateSupplyConsumption = () => {
    const consumption: Record<string, number> = {};
    
    // Initialize with all supplies
    supplies.forEach(supply => {
      consumption[supply.id] = 0;
    });
    
    // Calculate consumption from completed and in-production orders
    filteredOrders
      .filter(order => ['produção', 'concluído', 'enviado'].includes(order.status))
      .forEach(order => {
        supplies.forEach(supply => {
          if (supply.consumptionPerMeter) {
            consumption[supply.id] += order.finalMeters * supply.consumptionPerMeter;
          }
        });
      });
    
    return consumption;
  };

  const supplyConsumption = calculateSupplyConsumption();

  // Generate CSV content
  const generateCSV = (data: any[], headers: string[], fields: string[]) => {
    const headerRow = headers.join(',') + '\n';
    const dataRows = data.map(item => {
      return fields.map(field => {
        // Check if field is a nested property path (e.g., "customer.name")
        if (field.includes('.')) {
          const [obj, prop] = field.split('.');
          if (obj === 'customer') {
            const customer = customers.find(c => c.id === item.customerId);
            return `"${customer ? customer[prop as keyof typeof customer] || '' : ''}"`;
          }
        }
        
        // Handle date fields
        if (field === 'createdAt' || field === 'updatedAt') {
          return `"${formatDate(item[field])}"`;
        }
        
        // Normal field
        const value = item[field];
        return typeof value === 'string' ? `"${value}"` : value;
      }).join(',');
    }).join('\n');
    
    return headerRow + dataRows;
  };

  // Generic download function
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle download for different report types
  const handleDownload = (reportType: string) => {
    let content = '';
    let filename = '';
    
    switch (reportType) {
      case 'sales':
        content = generateCSV(
          completedOrders,
          ['Cliente', 'Arquivo', 'Metros', 'Data', 'Status', 'Valor Estimado (R$)'],
          ['customerId', 'fileName', 'finalMeters', 'updatedAt', 'status', 'finalMeters']
        );
        filename = 'relatorio-vendas.csv';
        break;
        
      case 'supplies':
        const supplyConsumptionArray = supplies.map(supply => ({
          id: supply.id,
          name: supply.name,
          type: supply.type,
          consumed: supplyConsumption[supply.id].toFixed(3),
          unit: supply.unit,
          remaining: supply.quantity.toFixed(2),
          reorderPoint: supply.reorderPoint
        }));
        
        content = generateCSV(
          supplyConsumptionArray,
          ['Nome', 'Tipo', 'Consumido', 'Unidade', 'Estoque Atual', 'Ponto de Reposição'],
          ['name', 'type', 'consumed', 'unit', 'remaining', 'reorderPoint']
        );
        filename = 'relatorio-insumos.csv';
        break;
        
      case 'inventory':
        const allInventory = [
          ...supplies.map(item => ({ 
            ...item, 
            category: 'Insumo', 
            description: `${item.type} - ${item.quantity} ${item.unit}`
          })),
          ...tubeModels.map(item => ({ 
            ...item, 
            category: 'Tubete', 
            description: item.size,
            unit: 'unidades'
          }))
        ];
        
        content = generateCSV(
          allInventory,
          ['Categoria', 'Nome', 'Descrição', 'Quantidade', 'Unidade', 'Ponto de Reposição'],
          ['category', 'name', 'description', 'quantity', 'unit', 'reorderPoint']
        );
        filename = 'relatorio-estoque.csv';
        break;
        
      case 'customers':
        content = generateCSV(
          customers,
          ['Nome', 'Empresa', 'Email', 'Telefone', 'Status', 'Último Contato'],
          ['name', 'company', 'email', 'phone', 'status', 'lastContact']
        );
        filename = 'relatorio-clientes.csv';
        break;
    }
    
    if (content) {
      downloadCSV(content, filename);
    }
  };

  const handleDateRangeChange = (range: '7days' | '30days' | '90days' | 'all' | 'custom') => {
    if (range === 'custom') {
      setIsCustomDate(true);
      // Set default date range to last 30 days if not already set
      if (!startDate) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
        setEndDate(new Date().toISOString().split('T')[0]);
      }
    } else {
      setIsCustomDate(false);
      setDateRange(range);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Relatórios</h1>
        
        {/* Date Filter Controls */}
        <div className="card mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700 font-medium">Período:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  !isCustomDate && dateRange === '7days' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => handleDateRangeChange('7days')}
              >
                Últimos 7 dias
              </button>
              
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  !isCustomDate && dateRange === '30days' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => handleDateRangeChange('30days')}
              >
                Últimos 30 dias
              </button>
              
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  !isCustomDate && dateRange === '90days' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => handleDateRangeChange('90days')}
              >
                Últimos 90 dias
              </button>
              
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  !isCustomDate && dateRange === 'all' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => handleDateRangeChange('all')}
              >
                Todo o período
              </button>
              
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  isCustomDate 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => handleDateRangeChange('custom')}
              >
                Personalizado
              </button>
            </div>
            
            {/* Custom date inputs */}
            {isCustomDate && (
              <div className="flex items-center space-x-2 ml-2">
                <input
                  type="date"
                  className="input py-1 px-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span>até</span>
                <input
                  type="date"
                  className="input py-1 px-2"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="sales">
          <TabsList>
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="supplies">Consumo de Insumos</TabsTrigger>
            <TabsTrigger value="inventory">Estoque</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
          </TabsList>
          
          {/* Sales Report Tab */}
          <TabsContent value="sales">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Relatório de Vendas</h2>
                <button 
                  className="btn btn-primary flex items-center" 
                  onClick={() => handleDownload('sales')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar CSV
                </button>
              </div>
              
              <div className="table-container">
                <table className="table">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col">Cliente</th>
                      <th scope="col">Arquivo</th>
                      <th scope="col">Metros</th>
                      <th scope="col">Data</th>
                      <th scope="col">Status</th>
                      <th scope="col">Valor Estimado (R$)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {completedOrders.map((order) => {
                      const customer = customers.find(c => c.id === order.customerId);
                      // Calculate estimated value (R$40 per meter as an example)
                      const estimatedValue = order.finalMeters * 40;
                      
                      return (
                        <tr key={order.id}>
                          <td className="font-medium text-gray-900">{customer?.name || 'Cliente não encontrado'}</td>
                          <td>{order.fileName}</td>
                          <td>{order.finalMeters} m</td>
                          <td>{formatDate(order.updatedAt)}</td>
                          <td>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              order.status === 'enviado' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status === 'enviado' ? 'Enviado' : 'Concluído'}
                            </span>
                          </td>
                          <td>R$ {estimatedValue.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                    {completedOrders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-gray-500">
                          Nenhum pedido concluído no período selecionado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {completedOrders.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total de pedidos: {completedOrders.length}</span>
                    <span className="font-medium">
                      Valor total: R$ {(completedOrders.reduce((sum, order) => sum + order.finalMeters * 40, 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Supply Consumption Report Tab */}
          <TabsContent value="supplies">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Relatório de Consumo de Insumos</h2>
                <button 
                  className="btn btn-primary flex items-center" 
                  onClick={() => handleDownload('supplies')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar CSV
                </button>
              </div>
              
              <div className="table-container">
                <table className="table">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col">Insumo</th>
                      <th scope="col">Tipo</th>
                      <th scope="col">Consumido</th>
                      <th scope="col">Unidade</th>
                      <th scope="col">Estoque Atual</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {supplies.map((supply) => {
                      const consumed = supplyConsumption[supply.id];
                      const supplyStatus = supply.quantity <= supply.reorderPoint 
                        ? 'Repor Estoque' 
                        : 'Estoque OK';
                      
                      return (
                        <tr key={supply.id}>
                          <td className="font-medium text-gray-900">{supply.name}</td>
                          <td>{supply.type}</td>
                          <td>{consumed.toFixed(3)}</td>
                          <td>{supply.unit}</td>
                          <td>{supply.quantity.toFixed(2)}</td>
                          <td>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              supplyStatus === 'Repor Estoque' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {supplyStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {supplies.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-gray-500">
                          Nenhum insumo registrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          {/* Inventory Report Tab */}
          <TabsContent value="inventory">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Relatório de Estoque</h2>
                <button 
                  className="btn btn-primary flex items-center" 
                  onClick={() => handleDownload('inventory')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar CSV
                </button>
              </div>
              
              <div className="table-container">
                <table className="table">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col">Categoria</th>
                      <th scope="col">Item</th>
                      <th scope="col">Descrição</th>
                      <th scope="col">Quantidade</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Supplies */}
                    {supplies.map((supply) => (
                      <tr key={`supply-${supply.id}`}>
                        <td>Insumo</td>
                        <td className="font-medium text-gray-900">{supply.name}</td>
                        <td>{supply.type} - {supply.unit}</td>
                        <td>{supply.quantity.toFixed(2)} {supply.unit}</td>
                        <td>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            supply.quantity <= supply.reorderPoint 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {supply.quantity <= supply.reorderPoint ? 'Repor Estoque' : 'Estoque OK'}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {/* Tube Models */}
                    {tubeModels.map((model) => (
                      <tr key={`tube-${model.id}`}>
                        <td>Tubete</td>
                        <td className="font-medium text-gray-900">{model.name}</td>
                        <td>{model.size}</td>
                        <td>{model.quantity} unidades</td>
                        <td>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            model.quantity <= model.reorderPoint 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {model.quantity <= model.reorderPoint ? 'Repor Estoque' : 'Estoque OK'}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {supplies.length === 0 && tubeModels.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-gray-500">
                          Nenhum item em estoque
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          {/* Customers Report Tab */}
          <TabsContent value="customers">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Relatório de Clientes</h2>
                <button 
                  className="btn btn-primary flex items-center" 
                  onClick={() => handleDownload('customers')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar CSV
                </button>
              </div>
              
              <div className="table-container">
                <table className="table">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col">Nome</th>
                      <th scope="col">Empresa</th>
                      <th scope="col">Email</th>
                      <th scope="col">Telefone</th>
                      <th scope="col">Status</th>
                      <th scope="col">Último Contato</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer.id}>
                        <td className="font-medium text-gray-900">{customer.name}</td>
                        <td>{customer.company}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone}</td>
                        <td>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            customer.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : customer.status === 'lead' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {customer.status === 'active' ? 'Ativo' : 
                             customer.status === 'lead' ? 'Lead' : 'Inativo'}
                          </span>
                        </td>
                        <td>{formatDate(customer.lastContact)}</td>
                      </tr>
                    ))}
                    {customers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-gray-500">
                          Nenhum cliente registrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {customers.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex space-x-6">
                    <span className="font-medium">Total de clientes: {customers.length}</span>
                    <span className="font-medium">
                      Ativos: {customers.filter(c => c.status === 'active').length}
                    </span>
                    <span className="font-medium">
                      Leads: {customers.filter(c => c.status === 'lead').length}
                    </span>
                    <span className="font-medium">
                      Inativos: {customers.filter(c => c.status === 'inactive').length}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportsPage;
