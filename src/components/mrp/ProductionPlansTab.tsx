import { useState } from 'react';
import { Calendar, Pencil, Search, Trash2 } from 'lucide-react';
import { useData, ProductionPlan, Product } from '../../context/DataContext';
import ProductionPlanModal from './ProductionPlanModal';

const ProductionPlansTab = () => {
  const { productionPlans, products, addProductionPlan, updateProductionPlan, deleteProductionPlan } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPlan, setCurrentPlan] = useState<ProductionPlan | null>(null);

  const handleAddClick = () => {
    setCurrentPlan(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (plan: ProductionPlan) => {
    setCurrentPlan(plan);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este plano de produção?')) {
      deleteProductionPlan(id);
    }
  };

  const handleSavePlan = (plan: ProductionPlan | Omit<ProductionPlan, 'id'>) => {
    if ('id' in plan) {
      updateProductionPlan(plan);
    } else {
      addProductionPlan(plan);
    }
    setIsModalOpen(false);
  };

  const getProductName = (productId: string): string => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Produto não encontrado';
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planned':
        return 'Planejado';
      case 'in-progress':
        return 'Em andamento';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const filteredPlans = productionPlans.filter(plan => {
    const productName = getProductName(plan.productId).toLowerCase();
    return productName.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-800">Planos de Produção</h2>
        <button 
          className="btn btn-primary flex items-center" 
          onClick={handleAddClick}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Novo Plano
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
            placeholder="Buscar planos de produção..."
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
                <th scope="col">Produto</th>
                <th scope="col">Quantidade</th>
                <th scope="col">Data Início</th>
                <th scope="col">Data Fim</th>
                <th scope="col">Status</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPlans.map((plan) => (
                <tr key={plan.id}>
                  <td className="font-medium text-gray-900">{getProductName(plan.productId)}</td>
                  <td>{plan.quantity}</td>
                  <td>{new Date(plan.startDate).toLocaleDateString('pt-BR')}</td>
                  <td>{new Date(plan.endDate).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(plan.status)}`}>
                      {getStatusText(plan.status)}
                    </span>
                  </td>
                  <td className="flex space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditClick(plan)}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteClick(plan.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPlans.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Nenhum plano de produção encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ProductionPlanModal
          plan={currentPlan}
          products={products}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePlan}
        />
      )}
    </div>
  );
};

export default ProductionPlansTab;
