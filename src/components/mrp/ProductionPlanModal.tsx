import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ProductionPlan, Product } from '../../context/DataContext';

interface ProductionPlanModalProps {
  plan: ProductionPlan | null;
  products: Product[];
  onClose: () => void;
  onSave: (plan: ProductionPlan | Omit<ProductionPlan, 'id'>) => void;
}

const ProductionPlanModal = ({ plan, products, onClose, onSave }: ProductionPlanModalProps) => {
  const [formData, setFormData] = useState<Omit<ProductionPlan, 'id'> & { id?: string }>({
    productId: products.length > 0 ? products[0].id : '',
    quantity: 0,
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    status: 'planned',
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        ...plan,
        startDate: plan.startDate.substring(0, 10),
        endDate: plan.endDate.substring(0, 10),
      });
    }
  }, [plan]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            {plan ? 'Editar Plano de Produção' : 'Novo Plano de Produção'}
          </h2>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div>
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
                Produto
              </label>
              <select
                id="productId"
                name="productId"
                required
                className="input mt-1"
                value={formData.productId}
                onChange={handleChange}
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
                {products.length === 0 && (
                  <option value="" disabled>
                    Nenhum produto disponível
                  </option>
                )}
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantidade
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                step="1"
                required
                className="input mt-1"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Data de Início
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                className="input mt-1"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                Data de Término
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                required
                className="input mt-1"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                required
                className="input mt-1"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="planned">Planejado</option>
                <option value="in-progress">Em andamento</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductionPlanModal;
