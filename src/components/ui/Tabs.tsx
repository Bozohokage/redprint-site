import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
  selectedTab: string;
  setSelectedTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const Tabs = ({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) => {
  const [selectedTab, setSelectedTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex space-x-2 border-b mb-6">{children}</div>;
};

export const TabsTrigger = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }
  
  const { selectedTab, setSelectedTab } = context;
  const isSelected = selectedTab === value;
  
  return (
    <button
      className={`px-4 py-2 font-medium text-sm focus:outline-none ${
        isSelected ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
      }`}
      onClick={() => setSelectedTab(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }
  
  const { selectedTab } = context;
  
  if (selectedTab !== value) {
    return null;
  }
  
  return <div>{children}</div>;
};
