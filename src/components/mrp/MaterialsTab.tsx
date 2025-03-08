import { useState } from 'react';
import { Pencil, Layers, Search, Trash2 } from 'lucide-react';
import { useData, Material } from '../../context/DataContext';
import MaterialModal from './MaterialModal';

const MaterialsTab = () => {
  const { materials, addMaterial, updateMaterial, deleteMaterial } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);

  const handleAddClick = () => {
    setCurrentMaterial(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (material: Material) => {
    setCurrentMaterial(material);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este material?')) {
      deleteMaterial(id);
    }
  };

  const handleSaveMaterial = (material: Material | Omit<Material, 'id'>) => {
    if ('id' in material) {
      updateMaterial(material);
    } else {
      addMaterial(material);
    }
    setIsModalOpen(false);
  };

  const filteredMaterials = materials.filter(material => 
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-800">Gerenciamento de Materiais</h2>
        <button 
          className="btn btn-primary flex items-center" 
          onClick={handleAddClick}
        >
          <Layers className="w-4 h-4 mr-2" />
          Novo Material
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
            placeholder="Buscar materiais..."
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
                <th scope="col">Quantidade</th>
                <th scope="col">Unidade</th>
                <th scope="col">Ponto de Reposição</th>
                <th scope="col">Status</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMaterials.map((material) => (
                <tr key={material.id}>
                  <td className="font-medium text-gray-900">{material.name}</td>
                  <td>{material.quantity}</td>
                  <td>{material.unit}</td>
                  <td>{material.reorderPoint}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      material.quantity <= material.reorderPoint
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {material.quantity <= material.reorderPoint ? 'Repor Estoque' : 'Estoque OK'}
                    </span>
                  </td>
                  <td className="flex space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditClick(material)}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteClick(material.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredMaterials.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Nenhum material encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <MaterialModal
          material={currentMaterial}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveMaterial}
        />
      )}
    </div>
  );
};

export default MaterialsTab;
