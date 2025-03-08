import { useState } from 'react';
import { Droplets, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useData, Supply } from '../../context/DataContext';
import SupplyModal from './SupplyModal';

const SuppliesTab = () => {
  const { supplies, addSupply, updateSupply, deleteSupply } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSupply, setCurrentSupply] = useState<Supply | null>(null);

  const handleAddClick = () => {
    setCurrentSupply(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (supply: Supply) => {
    setCurrentSupply(supply);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este insumo?')) {
      deleteSupply(id);
    }
  };

  const handleSaveSupply = (supply: Supply | Omit<Supply, 'id'>) => {
    if ('id' in supply) {
      updateSupply(supply);
    } else {
      addSupply(supply);
    }
    setIsModalOpen(false);
  };

  const filteredSupplies = supplies.filter(supply => 
    supply.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supply.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tinta':
        return <Droplets className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'tinta': return 'Tinta';
      case 'cola': return 'Cola';
      case 'filme': return 'Filme';
      case 'tubete': return 'Tubete';
      default: return type;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-800">Insumos de Impressão</h2>
        <button 
          className="btn btn-primary flex items-center" 
          onClick={handleAddClick}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Insumo
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
            placeholder="Buscar insumos..."
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
                <th scope="col">Nome</th>
                <th scope="col">Tipo</th>
                <th scope="col">Quantidade</th>
                <th scope="col">Unidade</th>
                <th scope="col">Consumo p/ Metro</th>
                <th scope="col">Ponto de Reposição</th>
                <th scope="col">Status</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSupplies.map((supply) => (
                <tr key={supply.id}>
                  <td className="font-medium text-gray-900">{supply.name}</td>
                  <td className="flex items-center">
                    {getTypeIcon(supply.type)}
                    <span className="ml-1">{getTypeLabel(supply.type)}</span>
                  </td>
                  <td>{supply.quantity}</td>
                  <td>{supply.unit}</td>
                  <td>{supply.consumptionPerMeter || 'N/A'}</td>
                  <td>{supply.reorderPoint}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      supply.quantity <= supply.reorderPoint
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {supply.quantity <= supply.reorderPoint ? 'Repor Estoque' : 'Estoque OK'}
                    </span>
                  </td>
                  <td className="flex space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditClick(supply)}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteClick(supply.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSupplies.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    Nenhum insumo encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <SupplyModal
          supply={currentSupply}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSupply}
        />
      )}
    </div>
  );
};

export default SuppliesTab;
