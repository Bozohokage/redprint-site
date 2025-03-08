import { useState, useEffect } from 'react';
import { Plus, Trash, X } from 'lucide-react';
import { Product, Supply } from '../../context/DataContext';
import { useData } from '../../context/DataContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product | Omit<Product, 'id'>) => void;
}

const ProductModal = ({ product, onClose, onSave }: ProductModalProps) => {
  const { supplies } = useData();
  
  const [formData, setFormData] = useState<Omit<Product, 'id'> & { id?: string }>({
    name: '',
    description: '',
    unit: 'm',
    price: 0,
    supplies: []
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const handleAddSupply = () => {
    // Find first supply not already added
    const unusedSupplies = supplies.filter(
      supply => !formData.supplies.some(s => s.supplyId === supply.id)
    );
    
    if (unusedSupplies.length > 0) {
      setFormData({
        ...formData,
        supplies: [
          ...formData.supplies,
          { supplyId: unusedSupplies[0].id, consumptionPerMeter: 0 }
        ]
      });
    } else {
      alert('Todos os insumos já foram adicionados a este produto.');
    }
  };
  
  const handleRemoveSupply = (index: number) => {
    const updatedSupplies = [...formData.supplies];
    updatedSupplies.splice(index, 1);
    setFormData({
      ...formData,
      supplies: updatedSupplies
    });
  };
  
  const handleSupplyChange = (index: number, field: 'supplyId' | 'consumptionPerMeter', value: string | number) => {
    const updatedSupplies = [...formData.supplies];
    
    if (field === 'supplyId') {
      updatedSupplies[index].supplyId = value as string;
    } else {
      updatedSupplies[index].consumptionPerMeter = value as number;
    }
    
    setFormData({
      ...formData,
      supplies: updatedSupplies
    });
  };
  
  // Filter supplies that haven't been added yet for the dropdown
  const getAvailableSupplies = (currentSupplyId: string) => {
    return supplies.filter(
      supply => supply.id === currentSupplyId || 
      !formData.supplies.some(s => s.supplyId === supply.id)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            {product ? 'Editar Produto' : 'Novo Produto'}
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome do Produto
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="input mt-1"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="input mt-1"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                  Unidade
                </label>
                <input
                  type="text"
                  id="unit"
                  name="unit"
                  required
                  className="input mt-1"
                  value={formData.unit}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Preço por {formData.unit} (R$)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  required
                  className="input mt-1"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Insumos Necessários
                </label>
                <button
                  type="button"
                  className="text-blue-600 text-sm flex items-center"
                  onClick={handleAddSupply}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Insumo
                </button>
              </div>
              
              {formData.supplies.length === 0 ? (
                <div className="text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded-md">
                  Nenhum insumo adicionado. Clique em "Adicionar Insumo".
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.supplies.map((supplyItem, index) => {
                    const supply = supplies.find(s => s.id === supplyItem.supplyId);
                    return (
                      <div key={index} className="flex items-center space-x-2 border p-2 rounded-md">
                        <div className="flex-grow">
                          <select
                            className="input mb-1 w-full"
                            value={supplyItem.supplyId}
                            onChange={(e) => handleSupplyChange(index, 'supplyId', e.target.value)}
                          >
                            {getAvailableSupplies(supplyItem.supplyId).map(supply => (
                              <option key={supply.id} value={supply.id}>
                                {supply.name} ({supply.unit})
                              </option>
                            ))}
                          </select>
                          <div className="flex items-center">
                            <input
                              type="number"
                              className="input w-full"
                              placeholder="Consumo por metro"
                              min="0"
                              step="0.001"
                              value={supplyItem.consumptionPerMeter}
                              onChange={(e) => handleSupplyChange(index, 'consumptionPerMeter', parseFloat(e.target.value) || 0)}
                            />
                            <span className="ml-2 text-sm text-gray-500 whitespace-nowrap">
                              {supply?.unit}/{formData.unit}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-red-500 p-1 hover:bg-red-50 rounded"
                          onClick={() => handleRemoveSupply(index)}
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
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

export default ProductModal;
