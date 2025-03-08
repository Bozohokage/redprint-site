import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { SupplyPurchase, Supply } from '../../context/DataContext';

interface SupplyPurchaseModalProps {
  purchase: SupplyPurchase | null;
  supplies: Supply[];
  onClose: () => void;
  onSave: (purchase: SupplyPurchase | Omit<SupplyPurchase, 'id'>) => void;
}

const SupplyPurchaseModal = ({ purchase, supplies, onClose, onSave }: SupplyPurchaseModalProps) => {
  const [formData, setFormData] = useState<Omit<SupplyPurchase, 'id'> & { id?: string }>({
    supplyId: supplies.length > 0 ? supplies[0].id : '',
    quantity: 0,
    purchaseDate: new Date().toISOString().substring(0, 10),
    supplier: '',
    price: 0,
    notes: ''
  });

  useEffect(() => {
    if (purchase) {
      setFormData({
        ...purchase,
        purchaseDate: purchase.purchaseDate.substring(0, 10),
      });
    }
  }, [purchase]);

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

  const selectedSupply = supplies.find(s => s.id === formData.supplyId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            {purchase ? 'Editar Compra de Insumo' : 'Nova Compra de Insumo'}
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
              <label htmlFor="supplyId" className="block text-sm font-medium text-gray-700">
                Insumo
              </label>
              <select
                id="supplyId"
                name="supplyId"
                required
                className="input mt-1"
                value={formData.supplyId}
                onChange={handleChange}
              >
                {supplies.map((supply) => (
                  <option key={supply.id} value={supply.id}>
                    {supply.name} ({supply.unit})
                  </option>
                ))}
                {supplies.length === 0 && (
                  <option value="" disabled>
                    Nenhum insumo disponível
                  </option>
                )}
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantidade {selectedSupply ? `(${selectedSupply.unit})` : ''}
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="0.001"
                step="0.001"
                required
                className="input mt-1"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
                Data da Compra
              </label>
              <input
                type="date"
                id="purchaseDate"
                name="purchaseDate"
                required
                className="input mt-1"
                value={formData.purchaseDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
                Fornecedor
              </label>
              <input
                type="text"
                id="supplier"
                name="supplier"
                required
                className="input mt-1"
                value={formData.supplier}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Preço (R$)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                min="0.01"
                step="0.01"
                required
                className="input mt-1"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Observações
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="input mt-1"
                value={formData.notes}
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

export default SupplyPurchaseModal;
