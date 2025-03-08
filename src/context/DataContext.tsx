import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  cnpjCpf: string; // CNPJ ou CPF
  stateRegistration: string; // Inscrição Estadual
  deliveryAddress: string; // Endereço de entrega
  status: 'lead' | 'active' | 'inactive';
  lastContact: string;
}

export interface Supply {
  id: string;
  name: string;
  description: string; // Descrição do insumo
  type: 'tinta' | 'cola' | 'filme' | 'tubete';
  quantity: number;
  unit: string;
  reorderPoint: number;
  consumptionPerMeter?: number;
}

export interface SupplyPurchase {
  id: string;
  supplyId: string;
  quantity: number;
  purchaseDate: string;
  supplier: string;
  price: number;
  notes?: string;
}

export interface TubeModel {
  id: string;
  name: string;
  size: string;
  quantity: number;
  reorderPoint: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  unit: string;
  price: number;
  supplies: Array<{supplyId: string, consumptionPerMeter: number}>;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
}

export interface PixKey {
  id: string;
  type: 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria';
  key: string;
  description: string;
}

export interface PrintOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  productId: string;
  quantity: number;
  price: number;
  totalValue: number;
  sellerId: string;
  status: 'analise' | 'aprovado' | 'producao' | 'expedição' | 'entregue' | 'rejeitado';
  paymentMethod: 'pix' | 'credito' | 'dinheiro' | 'boleto' | 'transferencia';
  pixKeyId?: string; // Referência à chave PIX usada, se aplicável
  paymentStatus: 'pendente' | 'pago';
  tubeModelId: string;
  tubeQuantity: number;
  deliveryDate: string;
  createdAt: string;
  createdTime: string;
  updatedAt: string;
  notes: string;
}

interface DataContextType {
  // CRM data
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  
  // Supplies data
  supplies: Supply[];
  addSupply: (supply: Omit<Supply, 'id'>) => void;
  updateSupply: (supply: Supply) => void;
  deleteSupply: (id: string) => void;
  
  // Supply Purchases
  supplyPurchases: SupplyPurchase[];
  addSupplyPurchase: (purchase: Omit<SupplyPurchase, 'id'>) => void;
  updateSupplyPurchase: (purchase: SupplyPurchase) => void;
  deleteSupplyPurchase: (id: string) => void;
  
  // Tube models
  tubeModels: TubeModel[];
  addTubeModel: (model: Omit<TubeModel, 'id'>) => void;
  updateTubeModel: (model: TubeModel) => void;
  deleteTubeModel: (id: string) => void;
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  // Sellers
  sellers: Seller[];
  addSeller: (seller: Omit<Seller, 'id'>) => void;
  updateSeller: (seller: Seller) => void;
  deleteSeller: (id: string) => void;
  
  // PIX Keys
  pixKeys: PixKey[];
  addPixKey: (pixKey: Omit<PixKey, 'id'>) => void;
  updatePixKey: (pixKey: PixKey) => void;
  deletePixKey: (id: string) => void;
  
  // Print orders
  printOrders: PrintOrder[];
  addPrintOrder: (order: Omit<PrintOrder, 'id' | 'orderNumber'>) => void;
  updatePrintOrder: (order: PrintOrder) => void;
  deletePrintOrder: (id: string) => void;
  
  // Order operations
  approveOrderFiles: (orderId: string) => void;
  rejectOrderFiles: (orderId: string) => void;
  moveOrderToProduction: (orderId: string) => void;
  completeOrder: (orderId: string, tubeModelId: string) => void;
  shipOrder: (orderId: string) => void;
  
  // Utility functions
  checkSuppliesAvailability: (productId: string, quantity: number) => { available: boolean; insufficient: Supply[] };
  openOrderFolder: (orderNumber: string) => void;
  printShippingLabel: (orderId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Sample data
const initialCustomers: Customer[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 98765-4321',
    company: 'Design Master',
    cnpjCpf: '123.456.789-00',
    stateRegistration: 'Isento',
    deliveryAddress: 'Rua das Flores, 123, São Paulo, SP',
    status: 'active',
    lastContact: '2023-06-15',
  },
  {
    id: '2',
    name: 'Maria Souza',
    email: 'maria@confeccoes.com',
    phone: '(21) 99876-5432',
    company: 'Confecções Souza',
    cnpjCpf: '12.345.678/0001-90',
    stateRegistration: '123456789',
    deliveryAddress: 'Av. Paulista, 1500, São Paulo, SP',
    status: 'active',
    lastContact: '2023-07-22',
  },
];

const initialSupplies: Supply[] = [
  {
    id: '1',
    name: 'Tinta Preta DTF',
    description: 'Tinta preta para impressão DTF de alta qualidade',
    type: 'tinta',
    quantity: 2.5,
    unit: 'L',
    reorderPoint: 0.5,
    consumptionPerMeter: 0.01
  },
  {
    id: '2',
    name: 'Tinta Ciano DTF',
    description: 'Tinta ciano para impressão DTF',
    type: 'tinta',
    quantity: 2,
    unit: 'L',
    reorderPoint: 0.5,
    consumptionPerMeter: 0.008
  },
  {
    id: '3',
    name: 'Tinta Magenta DTF',
    description: 'Tinta magenta para impressão DTF',
    type: 'tinta',
    quantity: 2,
    unit: 'L',
    reorderPoint: 0.5,
    consumptionPerMeter: 0.008
  },
  {
    id: '4',
    name: 'Tinta Amarela DTF',
    description: 'Tinta amarela para impressão DTF',
    type: 'tinta',
    quantity: 2,
    unit: 'L',
    reorderPoint: 0.5,
    consumptionPerMeter: 0.007
  },
  {
    id: '5',
    name: 'Tinta Branca DTF',
    description: 'Tinta branca para impressão DTF',
    type: 'tinta',
    quantity: 3,
    unit: 'L',
    reorderPoint: 1,
    consumptionPerMeter: 0.02
  },
  {
    id: '6',
    name: 'Cola em Pó DTF',
    description: 'Cola em pó para fixação da impressão DTF',
    type: 'cola',
    quantity: 5,
    unit: 'kg',
    reorderPoint: 1,
    consumptionPerMeter: 0.01
  },
  {
    id: '7',
    name: 'Filme PET DTF',
    description: 'Filme base para impressão DTF',
    type: 'filme',
    quantity: 100,
    unit: 'm',
    reorderPoint: 20,
    consumptionPerMeter: 1
  }
];

const initialSupplyPurchases: SupplyPurchase[] = [
  {
    id: '1',
    supplyId: '1',
    quantity: 5,
    purchaseDate: '2023-09-15',
    supplier: 'Insumos DTF Ltda',
    price: 250.00,
    notes: 'Compra inicial de tinta preta'
  },
  {
    id: '2',
    supplyId: '7',
    quantity: 200,
    purchaseDate: '2023-09-20',
    supplier: 'Materiais Gráficos SA',
    price: 1200.00,
    notes: 'Filme PET com entrega expressa'
  }
];

const initialTubeModels: TubeModel[] = [
  {
    id: '1',
    name: 'Tubete Padrão',
    size: '8cm x 50cm',
    quantity: 100,
    reorderPoint: 20
  },
  {
    id: '2',
    name: 'Tubete Grande',
    size: '10cm x 100cm',
    quantity: 50,
    reorderPoint: 10
  }
];

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'DTF Padrão',
    description: 'Impressão DTF Padrão em PET',
    unit: 'm',
    price: 40.00,
    supplies: [
      { supplyId: '1', consumptionPerMeter: 0.01 },
      { supplyId: '5', consumptionPerMeter: 0.02 },
      { supplyId: '6', consumptionPerMeter: 0.01 },
      { supplyId: '7', consumptionPerMeter: 1 }
    ]
  },
  {
    id: '2',
    name: 'DTF Premium',
    description: 'Impressão DTF Premium com maior durabilidade',
    unit: 'm',
    price: 60.00,
    supplies: [
      { supplyId: '1', consumptionPerMeter: 0.012 },
      { supplyId: '2', consumptionPerMeter: 0.01 },
      { supplyId: '3', consumptionPerMeter: 0.01 },
      { supplyId: '4', consumptionPerMeter: 0.01 },
      { supplyId: '5', consumptionPerMeter: 0.025 },
      { supplyId: '6', consumptionPerMeter: 0.015 },
      { supplyId: '7', consumptionPerMeter: 1 }
    ]
  },
  {
    id: '3',
    name: 'DTF Sublimação',
    description: 'Impressão DTF com efeito de sublimação',
    unit: 'm',
    price: 55.00,
    supplies: [
      { supplyId: '2', consumptionPerMeter: 0.015 },
      { supplyId: '3', consumptionPerMeter: 0.015 },
      { supplyId: '4', consumptionPerMeter: 0.015 },
      { supplyId: '5', consumptionPerMeter: 0.02 },
      { supplyId: '6', consumptionPerMeter: 0.01 },
      { supplyId: '7', consumptionPerMeter: 1 }
    ]
  }
];

const initialSellers: Seller[] = [
  {
    id: '1',
    name: 'Carlos Vendas',
    email: 'carlos@grafica.com'
  },
  {
    id: '2',
    name: 'Ana Marketing',
    email: 'ana@grafica.com'
  }
];

const initialPixKeys: PixKey[] = [
  {
    id: '1',
    type: 'cpf',
    key: '123.456.789-00',
    description: 'CPF do Proprietário'
  },
  {
    id: '2',
    type: 'cnpj',
    key: '12.345.678/0001-90',
    description: 'CNPJ da Empresa'
  },
  {
    id: '3',
    type: 'email',
    key: 'financeiro@grafica.com',
    description: 'Email Financeiro'
  }
];

const initialPrintOrders: PrintOrder[] = [
  {
    id: '1',
    orderNumber: 'P001',
    customerId: '1',
    productId: '1',
    quantity: 10,
    price: 40,
    totalValue: 400,
    sellerId: '1',
    status: 'analise',
    paymentMethod: 'pix',
    pixKeyId: '1',
    paymentStatus: 'pago',
    tubeModelId: '',
    tubeQuantity: 0,
    deliveryDate: '2023-10-10',
    createdAt: '2023-10-01',
    createdTime: '10:00',
    updatedAt: '2023-10-01T14:30:00Z',
    notes: 'Impressão de logo para camisetas'
  },
  {
    id: '2',
    orderNumber: 'P002',
    customerId: '2',
    productId: '2',
    quantity: 5,
    price: 60,
    totalValue: 300,
    sellerId: '2',
    status: 'analise',
    paymentMethod: 'credito',
    paymentStatus: 'pendente',
    tubeModelId: '',
    tubeQuantity: 0,
    deliveryDate: '2023-10-15',
    createdAt: '2023-10-05',
    createdTime: '09:15',
    updatedAt: '2023-10-05T09:15:00Z',
    notes: 'Cliente solicitou amostra física antes'
  }
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state with localStorage data or initial data
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('crm-customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });
  
  const [supplies, setSupplies] = useState<Supply[]>(() => {
    const saved = localStorage.getItem('supplies');
    return saved ? JSON.parse(saved) : initialSupplies;
  });
  
  const [supplyPurchases, setSupplyPurchases] = useState<SupplyPurchase[]>(() => {
    const saved = localStorage.getItem('supply-purchases');
    return saved ? JSON.parse(saved) : initialSupplyPurchases;
  });
  
  const [tubeModels, setTubeModels] = useState<TubeModel[]>(() => {
    const saved = localStorage.getItem('tube-models');
    return saved ? JSON.parse(saved) : initialTubeModels;
  });
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  
  const [sellers, setSellers] = useState<Seller[]>(() => {
    const saved = localStorage.getItem('sellers');
    return saved ? JSON.parse(saved) : initialSellers;
  });
  
  const [pixKeys, setPixKeys] = useState<PixKey[]>(() => {
    const saved = localStorage.getItem('pix-keys');
    return saved ? JSON.parse(saved) : initialPixKeys;
  });
  
  const [printOrders, setPrintOrders] = useState<PrintOrder[]>(() => {
    const saved = localStorage.getItem('print-orders');
    return saved ? JSON.parse(saved) : initialPrintOrders;
  });

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('crm-customers', JSON.stringify(customers));
  }, [customers]);
  
  useEffect(() => {
    localStorage.setItem('supplies', JSON.stringify(supplies));
  }, [supplies]);
  
  useEffect(() => {
    localStorage.setItem('supply-purchases', JSON.stringify(supplyPurchases));
  }, [supplyPurchases]);
  
  useEffect(() => {
    localStorage.setItem('tube-models', JSON.stringify(tubeModels));
  }, [tubeModels]);
  
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);
  
  useEffect(() => {
    localStorage.setItem('sellers', JSON.stringify(sellers));
  }, [sellers]);
  
  useEffect(() => {
    localStorage.setItem('pix-keys', JSON.stringify(pixKeys));
  }, [pixKeys]);
  
  useEffect(() => {
    localStorage.setItem('print-orders', JSON.stringify(printOrders));
  }, [printOrders]);

  // Generate a simple ID (not for production use)
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Generate order number (P followed by 3 digits)
  const generateOrderNumber = () => {
    // Handle undefined or improperly formatted order numbers
    const orderNumbers = printOrders
      .filter(order => order.orderNumber && typeof order.orderNumber === 'string' && order.orderNumber.startsWith('P'))
      .map(order => {
        try {
          // Only process strings that match the expected format (P followed by digits)
          const match = order.orderNumber.match(/^P(\d+)$/);
          if (match && match[1]) {
            return parseInt(match[1], 10);
          }
          return 0;
        } catch (error) {
          return 0;
        }
      })
      .filter(num => !isNaN(num) && num > 0);
    
    // Get the highest order number or default to 0
    const lastOrder = orderNumbers.length > 0 ? Math.max(...orderNumbers) : 0;
    
    // Generate the next order number
    const newOrderNumber = lastOrder + 1;
    return `P${newOrderNumber.toString().padStart(3, '0')}`;
  };

  // Get current timestamp in ISO format
  const getCurrentTimestamp = () => new Date().toISOString();
  
  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };
  
  // Get current time in HH:MM format
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  // CRM functions
  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = { ...customer, id: generateId() };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers(customers.map(c => c.id === customer.id ? customer : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  // Supply functions
  const addSupply = (supply: Omit<Supply, 'id'>) => {
    const newSupply = { ...supply, id: generateId() };
    setSupplies([...supplies, newSupply]);
  };

  const updateSupply = (supply: Supply) => {
    setSupplies(supplies.map(s => s.id === supply.id ? supply : s));
  };

  const deleteSupply = (id: string) => {
    setSupplies(supplies.filter(s => s.id !== id));
  };
  
  // Supply Purchase functions
  const addSupplyPurchase = (purchase: Omit<SupplyPurchase, 'id'>) => {
    const newPurchase = { ...purchase, id: generateId() };
    setSupplyPurchases([...supplyPurchases, newPurchase]);
    
    // Update supply quantity based on purchase
    const updatedSupplies = supplies.map(supply => {
      if (supply.id === purchase.supplyId) {
        return {
          ...supply,
          quantity: supply.quantity + purchase.quantity
        };
      }
      return supply;
    });
    
    setSupplies(updatedSupplies);
  };

  const updateSupplyPurchase = (purchase: SupplyPurchase) => {
    // Find original purchase to calculate quantity difference
    const originalPurchase = supplyPurchases.find(p => p.id === purchase.id);
    
    if (originalPurchase) {
      // Calculate quantity difference
      const quantityDiff = purchase.quantity - originalPurchase.quantity;
      
      // Only update supply quantity if supply ID is the same and there's a quantity change
      if (purchase.supplyId === originalPurchase.supplyId && quantityDiff !== 0) {
        setSupplies(supplies.map(supply => {
          if (supply.id === purchase.supplyId) {
            return {
              ...supply,
              quantity: Math.max(0, supply.quantity + quantityDiff)
            };
          }
          return supply;
        }));
      } else if (purchase.supplyId !== originalPurchase.supplyId) {
        // If supply ID changed, remove quantity from old supply and add to new supply
        setSupplies(supplies.map(supply => {
          if (supply.id === originalPurchase.supplyId) {
            return {
              ...supply,
              quantity: Math.max(0, supply.quantity - originalPurchase.quantity)
            };
          } else if (supply.id === purchase.supplyId) {
            return {
              ...supply,
              quantity: supply.quantity + purchase.quantity
            };
          }
          return supply;
        }));
      }
    }
    
    setSupplyPurchases(supplyPurchases.map(p => p.id === purchase.id ? purchase : p));
  };

  const deleteSupplyPurchase = (id: string) => {
    const purchaseToDelete = supplyPurchases.find(p => p.id === id);
    
    if (purchaseToDelete) {
      // Remove quantity from supply
      setSupplies(supplies.map(supply => {
        if (supply.id === purchaseToDelete.supplyId) {
          return {
            ...supply,
            quantity: Math.max(0, supply.quantity - purchaseToDelete.quantity)
          };
        }
        return supply;
      }));
    }
    
    setSupplyPurchases(supplyPurchases.filter(p => p.id !== id));
  };

  // Tube model functions
  const addTubeModel = (model: Omit<TubeModel, 'id'>) => {
    const newModel = { ...model, id: generateId() };
    setTubeModels([...tubeModels, newModel]);
  };

  const updateTubeModel = (model: TubeModel) => {
    setTubeModels(tubeModels.map(m => m.id === model.id ? model : m));
  };

  const deleteTubeModel = (id: string) => {
    setTubeModels(tubeModels.filter(m => m.id !== id));
  };
  
  // Product functions
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: generateId() };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (product: Product) => {
    setProducts(products.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };
  
  // Seller functions
  const addSeller = (seller: Omit<Seller, 'id'>) => {
    const newSeller = { ...seller, id: generateId() };
    setSellers([...sellers, newSeller]);
  };

  const updateSeller = (seller: Seller) => {
    setSellers(sellers.map(s => s.id === seller.id ? seller : s));
  };

  const deleteSeller = (id: string) => {
    setSellers(sellers.filter(s => s.id !== id));
  };
  
  // PIX Key functions
  const addPixKey = (pixKey: Omit<PixKey, 'id'>) => {
    const newPixKey = { ...pixKey, id: generateId() };
    setPixKeys([...pixKeys, newPixKey]);
  };

  const updatePixKey = (pixKey: PixKey) => {
    setPixKeys(pixKeys.map(p => p.id === pixKey.id ? pixKey : p));
  };

  const deletePixKey = (id: string) => {
    setPixKeys(pixKeys.filter(p => p.id !== id));
  };

  // Print order functions
  const addPrintOrder = (order: Omit<PrintOrder, 'id' | 'orderNumber'>) => {
    const now = getCurrentTimestamp();
    const newOrder = { 
      ...order, 
      id: generateId(),
      orderNumber: generateOrderNumber(),
      createdAt: getCurrentDate(),
      createdTime: getCurrentTime(),
      updatedAt: now
    };
    setPrintOrders([...printOrders, newOrder]);
  };

  const updatePrintOrder = (order: PrintOrder) => {
    const updatedOrder = {
      ...order,
      updatedAt: getCurrentTimestamp()
    };
    setPrintOrders(printOrders.map(o => o.id === order.id ? updatedOrder : o));
  };

  const deletePrintOrder = (id: string) => {
    setPrintOrders(printOrders.filter(o => o.id !== id));
  };

  // Order operations
  const approveOrderFiles = (orderId: string) => {
    setPrintOrders(printOrders.map(order => {
      if (order.id === orderId && order.status === 'analise') {
        // Verificar se o pedido está pago
        if (order.paymentStatus === 'pago') {
          // Verificar disponibilidade de insumos
          const { available } = checkSuppliesAvailability(order.productId, order.quantity);
          
          // Se tiver insumos suficientes, move direto para produção
          if (available) {
            return {
              ...order,
              status: 'producao',
              updatedAt: getCurrentTimestamp()
            };
          } else {
            // Se não tiver insumos suficientes, apenas aprova o arquivo
            return {
              ...order,
              status: 'aprovado',
              updatedAt: getCurrentTimestamp()
            };
          }
        } else {
          // Se não estiver pago, apenas aprova o arquivo
          return {
            ...order,
            status: 'aprovado',
            updatedAt: getCurrentTimestamp()
          };
        }
      }
      return order;
    }));
  };
  
  const rejectOrderFiles = (orderId: string) => {
    setPrintOrders(printOrders.map(order => {
      if (order.id === orderId && order.status === 'analise') {
        return {
          ...order,
          status: 'rejeitado',
          updatedAt: getCurrentTimestamp()
        };
      }
      return order;
    }));
  };

  const moveOrderToProduction = (orderId: string) => {
    // Find the order
    const order = printOrders.find(o => o.id === orderId);
    if (!order || (order.status !== 'aprovado' && order.status !== 'pago')) return;
    
    // Get the product
    const product = products.find(p => p.id === order.productId);
    if (!product) return;

    // Check if we have enough supplies
    const { available } = checkSuppliesAvailability(order.productId, order.quantity);
    if (!available) return;

    // Update supplies based on consumption rates
    const updatedSupplies = supplies.map(supply => {
      // Find if this supply is used in the product
      const supplyUsage = product.supplies.find(s => s.supplyId === supply.id);
      if (supplyUsage) {
        const consumedAmount = order.quantity * supplyUsage.consumptionPerMeter;
        return {
          ...supply,
          quantity: Math.max(0, supply.quantity - consumedAmount)
        };
      }
      return supply;
    });

    // Update order status
    const updatedOrders = printOrders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'producao',
          updatedAt: getCurrentTimestamp()
        };
      }
      return o;
    });

    // Update states
    setSupplies(updatedSupplies);
    setPrintOrders(updatedOrders);
  };

  const completeOrder = (orderId: string, tubeModelId: string) => {
    // Find the order
    const order = printOrders.find(o => o.id === orderId);
    if (!order || order.status !== 'producao') return;

    // Find the tube model
    const tubeModel = tubeModels.find(t => t.id === tubeModelId);
    if (!tubeModel || tubeModel.quantity < 1) return;

    // Update tube model quantity
    const updatedTubeModels = tubeModels.map(model => {
      if (model.id === tubeModelId) {
        return {
          ...model,
          quantity: Math.max(0, model.quantity - 1)
        };
      }
      return model;
    });

    // Update order status
    const updatedOrders = printOrders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'expedição',
          tubeModelId,
          tubeQuantity: 1,
          updatedAt: getCurrentTimestamp()
        };
      }
      return o;
    });

    // Update states
    setTubeModels(updatedTubeModels);
    setPrintOrders(updatedOrders);
  };

  const shipOrder = (orderId: string) => {
    setPrintOrders(printOrders.map(order => {
      if (order.id === orderId && order.status === 'expedição') {
        return {
          ...order,
          status: 'entregue',
          updatedAt: getCurrentTimestamp()
        };
      }
      return order;
    }));
  };
  
  // Utility functions
  const checkSuppliesAvailability = (productId: string, quantity: number) => {
    // Get the product
    const product = products.find(p => p.id === productId);
    
    // If product doesn't exist or doesn't have supplies property, return "not available"
    if (!product || !product.supplies || !Array.isArray(product.supplies)) {
      return { available: false, insufficient: [] };
    }
    
    const insufficientSupplies: Supply[] = [];
    
    // Check each supply used in the product
    for (const supplyUsage of product.supplies) {
      const supply = supplies.find(s => s.id === supplyUsage.supplyId);
      
      // If supply exists and has consumption info
      if (supply && typeof supplyUsage.consumptionPerMeter === 'number') {
        const requiredAmount = quantity * supplyUsage.consumptionPerMeter;
        
        // Check if we have enough of this supply
        if (supply.quantity < requiredAmount) {
          insufficientSupplies.push(supply);
        }
      }
    }
    
    return {
      available: insufficientSupplies.length === 0,
      insufficient: insufficientSupplies
    };
  };
  
  const openOrderFolder = (orderNumber: string) => {
    // This is a simulation since web apps can't directly access the file system
    alert(`Simulando abertura da pasta do pedido: ${orderNumber}`);
    console.log(`Tentativa de abrir pasta: ${orderNumber}`);
  };
  
  const printShippingLabel = (orderId: string) => {
    const order = printOrders.find(o => o.id === orderId);
    if (!order) {
      alert('Pedido não encontrado!');
      return;
    }
    
    const customer = customers.find(c => c.id === order.customerId);
    if (!customer) {
      alert('Cliente não encontrado!');
      return;
    }
    
    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Generate label content with HTML
    const labelContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Etiqueta de Expedição - ${order.orderNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
          }
          .label-container {
            border: 2px solid #000;
            padding: 20px;
            width: 90%;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .company-name {
            font-size: 24pt;
            font-weight: bold;
          }
          .section {
            margin-bottom: 15px;
          }
          .section-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .section-content {
            font-size: 12pt;
          }
          .order-number {
            font-size: 18pt;
            font-weight: bold;
            text-align: center;
            margin-top: 20px;
            border-top: 1px solid #000;
            padding-top: 10px;
          }
          .columns {
            display: flex;
            justify-content: space-between;
          }
          .column {
            width: 48%;
          }
          .footer {
            margin-top: 20px;
            font-size: 10pt;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="label-container">
          <div class="header">
            <div class="company-name">Gráfica DTF</div>
            <div style="font-size: 12pt;">Impressão de alta qualidade</div>
          </div>
          
          <div class="columns">
            <div class="column">
              <div class="section">
                <div class="section-title">DESTINATÁRIO:</div>
                <div class="section-content">
                  ${customer.name}<br>
                  ${customer.company}<br>
                  ${customer.deliveryAddress}
                </div>
              </div>
              
              <div class="section">
                <div class="section-title">DADOS DO PEDIDO:</div>
                <div class="section-content">
                  Produto: ${products.find(p => p.id === order.productId)?.name || 'N/A'}<br>
                  Quantidade: ${order.quantity} ${products.find(p => p.id === order.productId)?.unit || 'm'}<br>
                  Data de Produção: ${new Date(order.updatedAt).toLocaleDateString('pt-BR')}<br>
                  Forma de Pagamento: ${order.paymentMethod === 'pix' ? 'PIX' : 
                                       order.paymentMethod === 'credito' ? 'Cartão de Crédito' : 
                                       order.paymentMethod === 'boleto' ? 'Boleto Bancário' :
                                       order.paymentMethod === 'transferencia' ? 'Transferência Bancária' : 'Dinheiro'}
                </div>
              </div>
            </div>
            
            <div class="column">
              <div class="section">
                <div class="section-title">CONTATO:</div>
                <div class="section-content">
                  Email: ${customer.email}<br>
                  Telefone: ${customer.phone}<br>
                  Vendedor: ${sellers.find(s => s.id === order.sellerId)?.name || 'N/A'}
                </div>
              </div>
              
              <div class="section">
                <div class="section-title">OBSERVAÇÕES:</div>
                <div class="section-content">
                  ${order.notes || 'Nenhuma observação adicional.'}
                </div>
              </div>
            </div>
          </div>
          
          <div class="order-number">
            PEDIDO: ${order.orderNumber}
          </div>
          
          <div class="footer">
            Tubete: ${tubeModels.find(t => t.id === order.tubeModelId)?.name || 'N/A'} - 
            Impresso em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Write content to iframe and print it
    iframe.contentWindow?.document.open();
    iframe.contentWindow?.document.write(labelContent);
    iframe.contentWindow?.document.close();
    
    // Wait a bit for content to render
    setTimeout(() => {
      iframe.contentWindow?.print();
      
      // Remove iframe after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  };

  const value = {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    
    supplies,
    addSupply,
    updateSupply,
    deleteSupply,
    
    supplyPurchases,
    addSupplyPurchase,
    updateSupplyPurchase,
    deleteSupplyPurchase,
    
    tubeModels,
    addTubeModel,
    updateTubeModel,
    deleteTubeModel,
    
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    
    sellers,
    addSeller,
    updateSeller,
    deleteSeller,
    
    pixKeys,
    addPixKey,
    updatePixKey,
    deletePixKey,
    
    printOrders,
    addPrintOrder,
    updatePrintOrder,
    deletePrintOrder,
    
    approveOrderFiles,
    rejectOrderFiles,
    moveOrderToProduction,
    completeOrder,
    shipOrder,
    
    checkSuppliesAvailability,
    openOrderFolder,
    printShippingLabel
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
