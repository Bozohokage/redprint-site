import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Material } from '../../context/DataContext';

interface MaterialModalProps {
  material: Material | null;
  onClose: () => void;
  onSave: (material: Material | Omit<Material, 'id'>) => void;
}

const MaterialModal = ({ material, onClose, onSave }: MaterialModalProps) => {
  const [formData, setFormData] = useState<Omit<Material, 'id'> & { id?: string }>({
    name: '',
    quantity: 0,
    unit: 'pç',
    reorderPoint: 0,
  });

  useEffect(() => {
    if (material) {
      setFormData(material);
    }
  }, [material]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            {material ? 'Editar Material' : 'Novo Material'}
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
                Nome
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
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantidade
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="0"
                step="1"
                required
                className="input mt-1"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

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
              <label htmlFor="reorderPoint" className="block text-sm font-medium text-gray-700">
                Ponto de Reposição
              </label>
              <input
                type="number"
                id="reorderPoint"
                name="reorderPoint"
                min="0"
                step="1"
                required
                className="input mt-1"
                value={formData.reorderPoint}
                onChange={handleChange}
              />
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

export default MaterialModal;
