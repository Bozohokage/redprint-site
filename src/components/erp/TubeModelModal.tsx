import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TubeModel } from '../../context/DataContext';

interface TubeModelModalProps {
  model: TubeModel | null;
  onClose: () => void;
  onSave: (model: TubeModel | Omit<TubeModel, 'id'>) => void;
}

const TubeModelModal = ({ model, onClose, onSave }: TubeModelModalProps) => {
  const [formData, setFormData] = useState<Omit<TubeModel, 'id'> & { id?: string }>({
    name: '',
    size: '',
    quantity: 0,
    reorderPoint: 0
  });

  useEffect(() => {
    if (model) {
      setFormData(model);
    }
  }, [model]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            {model ? 'Editar Modelo de Tubete' : 'Novo Modelo de Tubete'}
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
              <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                Tamanho
              </label>
              <input
                type="text"
                id="size"
                name="size"
                required
                className="input mt-1"
                value={formData.size}
                onChange={handleChange}
                placeholder="Ex: 8cm x 50cm"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantidade em Estoque
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

export default TubeModelModal;
