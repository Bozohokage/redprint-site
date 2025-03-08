import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import SuppliesTab from '../components/erp/SuppliesTab';
import TubeModelsTab from '../components/erp/TubeModelsTab';
import SupplyPurchasesTab from '../components/erp/SupplyPurchasesTab';

const ErpPage = () => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Gestão de Insumos</h1>
        
        <Tabs defaultValue="supplies">
          <TabsList>
            <TabsTrigger value="supplies">Insumos de Impressão</TabsTrigger>
            <TabsTrigger value="purchases">Compras de Insumos</TabsTrigger>
            <TabsTrigger value="tubes">Tubetes para Envio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="supplies">
            <SuppliesTab />
          </TabsContent>
          
          <TabsContent value="purchases">
            <SupplyPurchasesTab />
          </TabsContent>
          
          <TabsContent value="tubes">
            <TubeModelsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ErpPage;
