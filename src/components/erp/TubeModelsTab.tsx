import { useState } from 'react';
import { Package, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useData, TubeModel } from '../../context/DataContext';
import TubeModelModal from './TubeModelModal';

const TubeModelsTab = () => {
  const { tubeModels, addTubeModel, updateTubeModel, deleteTubeModel } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentModel, setCurrentModel] = useState<TubeModel | null>(null);

  const handleAddClick = () => {
    setCurrentModel(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (model: TubeModel) => {
    setCurrentModel(model);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este modelo de tubete?')) {
      deleteTubeModel(id);
    }
  };

  const handleSaveModel = (model: TubeModel | Omit<TubeModel, 'id'>) => {
    if ('id' in model) {
      updateTubeModel(model);
    } else {
      addTubeModel(model);
    }
    setIsModalOpen(false);
  };

  const filteredModels = tubeModels.filter(model => 
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.size.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-800">Tubetes para Envio</h2>
        <button 
          className="btn btn-primary flex items-center" 
          onClick={handleAddClick}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Modelo
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
            placeholder="Buscar modelos de tubetes..."
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
                <th scope="col">Tamanho</th>
                <th scope="col">Quantidade</th>
                <th scope="col">Ponto de Reposição</th>
                <th scope="col">Status</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredModels.map((model) => (
                <tr key={model.id}>
                  <td className="font-medium text-gray-900">{model.name}</td>
                  <td>{model.size}</td>
                  <td>{model.quantity}</td>
                  <td>{model.reorderPoint}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      model.quantity <= model.reorderPoint
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {model.quantity <= model.reorderPoint ? 'Repor Estoque' : 'Estoque OK'}
                    </span>
                  </td>
                  <td className="flex space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditClick(model)}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteClick(model.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredModels.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Nenhum modelo de tubete encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <TubeModelModal
          model={currentModel}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveModel}
        />
      )}
    </div>
  );
};

export default TubeModelsTab;
