import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import './index.css';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CrmPage from './pages/CrmPage';
import ErpPage from './pages/ErpPage';
import MrpPage from './pages/MrpPage';
import ReportsPage from './pages/ReportsPage';
import { DataProvider } from './context/DataContext';

function App() {
  useEffect(() => {
    // Add Google Font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="crm" element={<CrmPage />} />
            <Route path="erp" element={<ErpPage />} />
            <Route path="mrp" element={<MrpPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
