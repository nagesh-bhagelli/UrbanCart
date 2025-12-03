import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import AuthPage from './pages/AuthPage';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import AdminProductForm from './pages/AdminProductForm';
import AdminDashboard from './pages/AdminDashboard';
import MyOrders from './pages/MyOrders';
import CartPage from './pages/CartPage';
import AuthProvider, { AuthContext } from './context/AuthContext';
import CartProvider from './context/CartContext';
import './index.css';

function PrivateRoute({ children }) {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Loading...</div>;
  }

  return user ? children : <Navigate to="/auth" />;
}

function AdminRoute({ children }) {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return user.role === 'admin' ? children : <Navigate to="/" />;
}

function RootLayout() {
  const { loading } = React.useContext(AuthContext);

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <App />
          </PrivateRoute>
        }
      >
        <Route index element={<ProductList />} />
        <Route path="products/:sku" element={<ProductDetail />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="my-orders" element={<MyOrders />} />
        <Route path="admin/product/new" element={<AdminProductForm />} />
        <Route path="admin/product/edit/:sku" element={<AdminProductForm />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);

try {
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <RootLayout />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </React.StrictMode>
  );
} catch (error) {
  console.error('React rendering error:', error);
  console.error('Stack:', error.stack);
  document.getElementById('root').innerHTML = `<div style="padding: 20px; color: red;">Error: ${error.message}</div>`;
}
