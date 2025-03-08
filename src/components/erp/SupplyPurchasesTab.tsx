import { useState } from 'react';
import { Calendar, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useData, SupplyPurchase } from '../../context/DataContext';
import SupplyPurchaseModal from './SupplyPurchaseModal';

const SupplyPurchasesTab = () => {
  const { supplyPurchases, supplies, addSupplyPurchase, updateSupplyPurchase, deleteSupplyPurchase } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPurchase, setCurrentPurchase] = useState<SupplyPurchase | null>(null);

  const handleAddClick = () => {
    setCurrentPurchase(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (purchase: SupplyPurchase) => {
    setCurrentPurchase(purchase);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta compra? A quantidade será removida do estoque.')) {
      deleteSupplyPurchase(id);
    }
  };

  const handleSavePurchase = (purchase: SupplyPurchase | Omit<SupplyPurchase, 'id'>) => {
    if ('id' in purchase) {
      updateSupplyPurchase(purchase);
    } else {
      addSupplyPurchase(purchase);
    }
    setIsModalOpen(false);
  };

  const getSupplyName = (supplyId: string): string => {
    const supply = supplies.find(s => s.id === supplyId);
    return supply ? `${supply.name} (${supply.unit})` : 'Insumo não encontrado';
  };

  const filteredPurchases = supplyPurchases.filter(purchase => {
    const supplyName = getSupplyName(purchase.supplyId).toLowerCase();
    const supplier = purchase.supplier.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return supplyName.includes(searchLower) || 
           supplier.includes(searchLower) || 
           purchase.purchaseDate.includes(searchLower);
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-800">Compras de Insumos</h2>
        <button 
          className="btn btn-primary flex items-center" 
          onClick={handleAddClick}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Compra
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
            placeholder="Buscar compras..."
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
                <th scope="col">Insumo</th>
                <th scope="col">Quantidade</th>
                <th scope="col">Data de Compra</th>
                <th scope="col">Fornecedor</th>
                <th scope="col">Preço (R$)</th>
                <th scope="col">Observações</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="font-medium text-gray-900">{getSupplyName(purchase.supplyId)}</td>
                  <td>{purchase.quantity}</td>
                  <td>{new Date(purchase.purchaseDate).toLocaleDateString('pt-BR')}</td>
                  <td>{purchase.supplier}</td>
                  <td>R$ {purchase.price.toFixed(2)}</td>
                  <td>{purchase.notes || '-'}</td>
                  <td className="flex space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditClick(purchase)}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteClick(purchase.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPurchases.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    Nenhuma compra de insumo encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <SupplyPurchaseModal
          purchase={currentPurchase}
          supplies={supplies}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePurchase}
        />
      )}
    </div>
  );
};

export default SupplyPurchasesTab;
