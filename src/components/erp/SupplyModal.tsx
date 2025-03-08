import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Supply } from '../../context/DataContext';

interface SupplyModalProps {
  supply: Supply | null;
  onClose: () => void;
  onSave: (supply: Supply | Omit<Supply, 'id'>) => void;
}

const SupplyModal = ({ supply, onClose, onSave }: SupplyModalProps) => {
  const [formData, setFormData] = useState<Omit<Supply, 'id'> & { id?: string }>({
    name: '',
    type: 'tinta',
    quantity: 0,
    unit: '',
    reorderPoint: 0,
    consumptionPerMeter: undefined
  });

  useEffect(() => {
    if (supply) {
      setFormData(supply);
    }
  }, [supply]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name === 'consumptionPerMeter' && value === '') {
      // Handle empty string for optional consumptionPerMeter
      setFormData({
        ...formData,
        [name]: undefined
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Determine if the consumption per meter field should be shown based on type
  const showConsumptionField = formData.type !== 'tubete';

  // Set appropriate unit based on type
  useEffect(() => {
    let defaultUnit = '';
    switch (formData.type) {
      case 'tinta':
        defaultUnit = 'L';
        break;
      case 'cola':
        defaultUnit = 'kg';
        break;
      case 'filme':
        defaultUnit = 'm';
        break;
      case 'tubete':
        defaultUnit = 'un';
        break;
    }
    
    if (!formData.unit || (supply === null)) {
      setFormData(prev => ({ ...prev, unit: defaultUnit }));
    }
  }, [formData.type, formData.unit, supply]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            {supply ? 'Editar Insumo' : 'Novo Insumo'}
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
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Tipo
              </label>
              <select
                id="type"
                name="type"
                required
                className="input mt-1"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="tinta">Tinta</option>
                <option value="cola">Cola</option>
                <option value="filme">Filme</option>
                <option value="tubete">Tubete</option>
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
                min="0"
                step="0.01"
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

            {showConsumptionField && (
              <div>
                <label htmlFor="consumptionPerMeter" className="block text-sm font-medium text-gray-700">
                  Consumo por Metro
                </label>
                <input
                  type="number"
                  id="consumptionPerMeter"
                  name="consumptionPerMeter"
                  min="0"
                  step="0.001"
                  className="input mt-1"
                  value={formData.consumptionPerMeter === undefined ? '' : formData.consumptionPerMeter}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Quanto deste insumo é consumido por metro de impressão
                </p>
              </div>
            )}

            <div>
              <label htmlFor="reorderPoint" className="block text-sm font-medium text-gray-700">
                Ponto de Reposição
              </label>
              <input
                type="number"
                id="reorderPoint"
                name="reorderPoint"
                min="0"
                step="0.01"
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

export default SupplyModal;
