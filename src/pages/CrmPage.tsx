import { useState } from 'react';
import { Pencil, Plus, Search, Trash2, UserPlus } from 'lucide-react';
import { useData, Customer } from '../context/DataContext';
import CustomerModal from '../components/crm/CustomerModal';

const CrmPage = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  const handleAddClick = () => {
    setCurrentCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteCustomer(id);
    }
  };

  const handleSaveCustomer = (customer: Customer | Omit<Customer, 'id'>) => {
    if ('id' in customer) {
      updateCustomer(customer);
    } else {
      addCustomer(customer);
    }
    setIsModalOpen(false);
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'lead':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Gerenciamento de Clientes</h1>
          <button 
            className="btn btn-primary flex items-center" 
            onClick={handleAddClick}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Cliente
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
              placeholder="Buscar clientes..."
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
                  <th scope="col">Empresa</th>
                  <th scope="col">Email</th>
                  <th scope="col">Telefone</th>
                  <th scope="col">Status</th>
                  <th scope="col">Último Contato</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="font-medium text-gray-900">{customer.name}</td>
                    <td>{customer.company}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(customer.status)}`}>
                        {customer.status === 'lead' ? 'Lead' : 
                         customer.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>{new Date(customer.lastContact).toLocaleDateString('pt-BR')}</td>
                    <td className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEditClick(customer)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteClick(customer.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      Nenhum cliente encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CustomerModal
          customer={currentCustomer}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCustomer}
        />
      )}
    </div>
  );
};

export default CrmPage;
