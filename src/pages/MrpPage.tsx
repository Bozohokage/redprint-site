import { useState, useEffect } from 'react';
import { ArrowRight, Box, CircleCheck, Clock, FileCheck, FileText, Inbox, Printer, Search, TrendingUp, Truck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import OrdersTab from '../components/mrp/OrdersTab';
import FilesAnalysisTab from '../components/mrp/FilesAnalysisTab';
import ProductionTab from '../components/mrp/ProductionTab';
import ShippingTab from '../components/mrp/ShippingTab';
import DeliveredOrdersTab from '../components/mrp/DeliveredOrdersTab';
import { useData } from '../context/DataContext';

const MrpPage = () => {
  const { printOrders } = useData();
  const [selectedTab, setSelectedTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    analysis: 0,
    production: 0,
    shipping: 0,
    delivered: 0
  });

  // Calculate order statistics
  useEffect(() => {
    setStats({
      total: printOrders.length,
      analysis: printOrders.filter(order => order.status === 'analise').length,
      production: printOrders.filter(order => order.status === 'producao').length,
      shipping: printOrders.filter(order => order.status === 'expedição').length,
      delivered: printOrders.filter(order => order.status === 'entregue').length
    });
  }, [printOrders]);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Gestão de Pedidos</h1>
          
          <div className="mt-4 md:mt-0 md:w-1/3">
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
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div 
            className={`card flex items-center p-4 cursor-pointer transition-all ${selectedTab === 'orders' ? 'border-blue-500 border-2' : ''}`}
            onClick={() => handleTabChange('orders')}
          >
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-3">
              <Inbox className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-xl font-semibold text-gray-800">{stats.total}</p>
            </div>
          </div>
          
          <div 
            className={`card flex items-center p-4 cursor-pointer transition-all ${selectedTab === 'analysis' ? 'border-blue-500 border-2' : ''}`}
            onClick={() => handleTabChange('analysis')}
          >
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-3">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Análise</p>
              <p className="text-xl font-semibold text-gray-800">{stats.analysis}</p>
            </div>
          </div>
          
          <div 
            className={`card flex items-center p-4 cursor-pointer transition-all ${selectedTab === 'production' ? 'border-blue-500 border-2' : ''}`}
            onClick={() => handleTabChange('production')}
          >
            <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-3">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Produção</p>
              <p className="text-xl font-semibold text-gray-800">{stats.production}</p>
            </div>
          </div>
          
          <div 
            className={`card flex items-center p-4 cursor-pointer transition-all ${selectedTab === 'shipping' ? 'border-blue-500 border-2' : ''}`}
            onClick={() => handleTabChange('shipping')}
          >
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Expedição</p>
              <p className="text-xl font-semibold text-gray-800">{stats.shipping}</p>
            </div>
          </div>
          
          <div 
            className={`card flex items-center p-4 cursor-pointer transition-all ${selectedTab === 'delivered' ? 'border-blue-500 border-2' : ''}`}
            onClick={() => handleTabChange('delivered')}
          >
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
              <CircleCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Entregues</p>
              <p className="text-xl font-semibold text-gray-800">{stats.delivered}</p>
            </div>
          </div>
        </div>
        
        {/* Order Flow Visualization */}
        <div className="card p-4 mb-6 hidden md:block">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Fluxo de Pedidos</h2>
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${selectedTab === 'analysis' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>
                <FileCheck className="h-8 w-8" />
              </div>
              <span className="mt-2 text-sm font-medium">Análise</span>
              <span className="text-xs text-gray-500">{stats.analysis} pedidos</span>
            </div>
            
            <ArrowRight className="h-5 w-5 text-gray-400" />
            
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${selectedTab === 'production' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                <Printer className="h-8 w-8" />
              </div>
              <span className="mt-2 text-sm font-medium">Produção</span>
              <span className="text-xs text-gray-500">{stats.production} pedidos</span>
            </div>
            
            <ArrowRight className="h-5 w-5 text-gray-400" />
            
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${selectedTab === 'shipping' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                <Box className="h-8 w-8" />
              </div>
              <span className="mt-2 text-sm font-medium">Expedição</span>
              <span className="text-xs text-gray-500">{stats.shipping} pedidos</span>
            </div>
            
            <ArrowRight className="h-5 w-5 text-gray-400" />
            
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${selectedTab === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                <TrendingUp className="h-8 w-8" />
              </div>
              <span className="mt-2 text-sm font-medium">Entregues</span>
              <span className="text-xs text-gray-500">{stats.delivered} pedidos</span>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="orders" value={selectedTab} onValueChange={handleTabChange}>
          <TabsList className="bg-white border-b p-0">
            <TabsTrigger 
              value="orders" 
              className="py-3 px-4 font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-700 rounded-none"
            >
              Todos os Pedidos
            </TabsTrigger>
            <TabsTrigger 
              value="analysis"
              className="py-3 px-4 font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-700 rounded-none"
            >
              Análise dos Arquivos
            </TabsTrigger>
            <TabsTrigger 
              value="production"
              className="py-3 px-4 font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-700 rounded-none"
            >
              Produção
            </TabsTrigger>
            <TabsTrigger 
              value="shipping"
              className="py-3 px-4 font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-700 rounded-none"
            >
              Expedição
            </TabsTrigger>
            <TabsTrigger 
              value="delivered"
              className="py-3 px-4 font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-700 rounded-none"
            >
              Entregues
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="orders">
              <OrdersTab searchTerm={searchTerm} />
            </TabsContent>
            
            <TabsContent value="analysis">
              <FilesAnalysisTab searchTerm={searchTerm} />
            </TabsContent>
            
            <TabsContent value="production">
              <ProductionTab searchTerm={searchTerm} />
            </TabsContent>
            
            <TabsContent value="shipping">
              <ShippingTab searchTerm={searchTerm} />
            </TabsContent>
            
            <TabsContent value="delivered">
              <DeliveredOrdersTab searchTerm={searchTerm} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MrpPage;
