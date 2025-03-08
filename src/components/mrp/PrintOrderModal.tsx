import { useState, useEffect } from 'react';
import { CircleAlert, X } from 'lucide-react';
import { PrintOrder, Customer, Product, Seller } from '../../context/DataContext';
import { useData } from '../../context/DataContext';

interface PrintOrderModalProps {
  order: PrintOrder | null;
  customers: Customer[];
  onClose: () => void;
  onSave: (order: PrintOrder | Omit<PrintOrder, 'id' | 'orderNumber'>) => void;
}

const PrintOrderModal = ({ order, customers, onClose, onSave }: PrintOrderModalProps) => {
  const { products, sellers, checkSuppliesAvailability } = useData();
  
  const [formData, setFormData] = useState<Omit<PrintOrder, 'id' | 'orderNumber'> & { id?: string, orderNumber?: string }>({
    customerId: customers.length > 0 ? customers[0].id : '',
    productId: products.length > 0 ? products[0].id : '',
    quantity: 0,
    price: products.length > 0 ? products[0].price : 0,
    totalValue: 0,
    sellerId: sellers.length > 0 ? sellers[0].id : '',
    status: 'analise',
    paymentMethod: 'pix',
    paymentStatus: 'pendente',
    tubeModelId: '',
    tubeQuantity: 0,
    deliveryDate: new Date().toISOString().substring(0, 10),
    createdAt: '',
    createdTime: '',
    updatedAt: '',
    notes: ''
  });
  
  const [showSuppliesWarning, setShowSuppliesWarning] = useState(false);
  const [insufficientSupplies, setInsufficientSupplies] = useState<string[]>([]);

  useEffect(() => {
    if (order) {
      setFormData(order);
    } else if (products.length > 0) {
      // Set default price when creating a new order
      setFormData(prev => ({
        ...prev,
        price: products[0].price,
        totalValue: prev.quantity * products[0].price
      }));
    }
  }, [order, products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    let parsedValue: string | number = value;
    if (type === 'number') {
      // Use parseFloat to handle decimal values properly
      parsedValue = value === '' ? 0 : parseFloat(value);
      
      // Ensure it's a valid number
      if (isNaN(parsedValue)) parsedValue = 0;
    }
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: parsedValue
      };
      
      // If product or quantity changed, update price and check supplies
      if (name === 'productId') {
        const selectedProduct = products.find(p => p.id === value);
        if (selectedProduct) {
          newData.price = selectedProduct.price;
          newData.totalValue = newData.quantity * selectedProduct.price;
          
          // Check supplies availability
          const result = checkSuppliesAvailability(value, newData.quantity);
          setShowSuppliesWarning(!result.available);
          setInsufficientSupplies(result.insufficient.map(s => s.name));
        }
      }
      
      // If quantity changed, recalculate total
      if (name === 'quantity' || name === 'price') {
        newData.totalValue = (typeof newData.quantity === 'number' ? newData.quantity : 0) * 
                            (typeof newData.price === 'number' ? newData.price : 0);
                            
        // Also check supplies if quantity changed
        if (name === 'quantity') {
          const result = checkSuppliesAvailability(newData.productId, parsedValue as number);
          setShowSuppliesWarning(!result.available);
          setInsufficientSupplies(result.insufficient.map(s => s.name));
        }
      }
      
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  // Find the selected product for display
  const selectedProduct = products.find(p => p.id === formData.productId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            {order ? 'Editar Pedido' : 'Novo Pedido'}
          </h2>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 space-y-3 overflow-y-auto flex-1">
            <div>
              <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
                Cliente
              </label>
              <select
                id="customerId"
                name="customerId"
                required
                className="input mt-1"
                value={formData.customerId}
                onChange={handleChange}
              >
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.company}
                  </option>
                ))}
                {customers.length === 0 && (
                  <option value="" disabled>
                    Nenhum cliente disponível
                  </option>
                )}
              </select>
            </div>
            
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
                    {product.name} - R$ {product.price.toFixed(2)}/{product.unit}
                  </option>
                ))}
                {products.length === 0 && (
                  <option value="" disabled>
                    Nenhum produto disponível
                  </option>
                )}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantidade {selectedProduct && `(${selectedProduct.unit})`}
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="0.1"
                  step="0.1"
                  required
                  className="input mt-1"
                  value={formData.quantity || ''}
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
                  value={formData.price || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="totalValue" className="block text-sm font-medium text-gray-700">
                Valor Total (R$)
              </label>
              <input
                type="number"
                id="totalValue"
                name="totalValue"
                disabled
                className="input mt-1 bg-gray-50"
                value={formData.totalValue || 0}
              />
            </div>
            
            <div>
              <label htmlFor="sellerId" className="block text-sm font-medium text-gray-700">
                Vendedor
              </label>
              <select
                id="sellerId"
                name="sellerId"
                required
                className="input mt-1"
                value={formData.sellerId}
                onChange={handleChange}
              >
                {sellers.map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.name}
                  </option>
                ))}
                {sellers.length === 0 && (
                  <option value="" disabled>
                    Nenhum vendedor disponível
                  </option>
                )}
              </select>
            </div>
            
            <div>
              <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700">
                Data de Entrega
              </label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                required
                className="input mt-1"
                value={formData.deliveryDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                Método de Pagamento
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                required
                className="input mt-1"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="pix">Pix</option>
                <option value="credito">Cartão de Crédito</option>
                <option value="dinheiro">Dinheiro</option>
              </select>
            </div>

            <div>
              <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">
                Status de Pagamento
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                required
                className="input mt-1"
                value={formData.paymentStatus}
                onChange={handleChange}
              >
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
              </select>
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
            
            {showSuppliesWarning && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-start">
                <CircleAlert className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Estoque insuficiente para este pedido!</p>
                  <p className="text-sm">Os seguintes insumos estão em falta:</p>
                  <ul className="list-disc list-inside text-sm">
                    {insufficientSupplies.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
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
              disabled={showSuppliesWarning}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrintOrderModal;
