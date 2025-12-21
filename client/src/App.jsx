import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerLedger from './pages/CustomerLedger';
import Layout from './components/Layout';
import useAuthStore from './store/authStore';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Layout>
                <Customers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/:customerId"
          element={
            <ProtectedRoute>
              <Layout>
                <CustomerLedger />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
