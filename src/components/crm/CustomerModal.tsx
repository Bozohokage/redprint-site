import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Customer } from '../../context/DataContext';

interface CustomerModalProps {
  customer: Customer | null;
  onClose: () => void;
  onSave: (customer: Customer | Omit<Customer, 'id'>) => void;
}

const CustomerModal = ({ customer, onClose, onSave }: CustomerModalProps) => {
  const [formData, setFormData] = useState<Omit<Customer, 'id'> & { id?: string }>({
    name: '',
    email: '',
    phone: '',
    company: '',
    cnpjCpf: '',
    stateRegistration: '',
    deliveryAddress: '',
    status: 'lead',
    lastContact: new Date().toISOString().substring(0, 10),
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        ...customer,
        lastContact: customer.lastContact.substring(0, 10),
      });
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            {customer ? 'Editar Cliente' : 'Novo Cliente'}
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
                Nome Fantasia
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cnpjCpf" className="block text-sm font-medium text-gray-700">
                  CNPJ / CPF
                </label>
                <input
                  type="text"
                  id="cnpjCpf"
                  name="cnpjCpf"
                  required
                  className="input mt-1"
                  value={formData.cnpjCpf}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="stateRegistration" className="block text-sm font-medium text-gray-700">
                  Inscrição Estadual
                </label>
                <input
                  type="text"
                  id="stateRegistration"
                  name="stateRegistration"
                  className="input mt-1"
                  value={formData.stateRegistration}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Empresa / Razão Social
              </label>
              <input
                type="text"
                id="company"
                name="company"
                className="input mt-1"
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">
                Endereço de Entrega
              </label>
              <textarea
                id="deliveryAddress"
                name="deliveryAddress"
                required
                rows={3}
                className="input mt-1"
                value={formData.deliveryAddress}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="input mt-1"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="input mt-1"
                value={formData.phone}
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
                className="input mt-1"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="lead">Lead</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>

            <div>
              <label htmlFor="lastContact" className="block text-sm font-medium text-gray-700">
                Último Contato
              </label>
              <input
                type="date"
                id="lastContact"
                name="lastContact"
                className="input mt-1"
                value={formData.lastContact}
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

export default CustomerModal;
