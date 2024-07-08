import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import ContentLayout from "./pages/Layout";
import Logup from './pages/Logup/Logup';
import Dashboard from './pages/Dashboard/Dashboard';
import Shares from './pages/Shares/Shares';
import Share from './pages/Share/Share';
import Trades from './pages/Trades/Trades';

const App: React.FC = () => {
  return (
      <Router>
        <Routes>
            <Route path="/sign-in" element={<Login />} />
            <Route path="/sign-up" element={<Logup />} />
            <Route path="/dashboard" element={<ContentLayout title='Dashboard' requireAuth><Dashboard/></ContentLayout>} />
            <Route path="/shares" element={<ContentLayout title='Shares' requireAuth><Shares/></ContentLayout>} />
            <Route path="/trades" element={<ContentLayout title='Trades' requireAuth><Trades/></ContentLayout>} />
            <Route path="/share" element={<ContentLayout title='Share' requireAuth><Share/></ContentLayout>} />
            <Route path="*" element={<Navigate to="/sign-in" />} />
        </Routes>
      </Router>
  );
};

export default App;
