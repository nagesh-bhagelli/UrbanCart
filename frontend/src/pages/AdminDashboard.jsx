import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchProducts, deleteProduct } from '../services/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [summary, setSummary] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    } else if (activeTab === 'inventory') {
      fetchLowStockProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'products') {
      fetchProductList();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [orderRes, inventoryRes] = await Promise.all([
        fetch(`${API_BASE}/admin/orders/summary`, {
          headers: { 'x-user-role': 'admin' }
        }),
        fetch(`${API_BASE}/admin/inventory/summary`, {
          headers: { 'x-user-role': 'admin' }
        })
      ]);

      const orderData = await orderRes.json();
      const inventoryData = await inventoryRes.json();

      setSummary({
        orders: orderData.data,
        inventory: inventoryData.data
      });
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    }
    setLoading(false);
  };

  const fetchLowStockProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/inventory/low-stock`, {
        headers: { 'x-user-role': 'admin' }
      });
      const data = await res.json();
      setLowStockProducts(data.data || []);
    } catch (err) {
      console.error('Error fetching low stock:', err);
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/orders`, {
        headers: { 'x-user-role': 'admin' }
      });
      const data = await res.json();
      setOrders(data.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, delivered) => {
    try {
      const res = await fetch(`${API_BASE}/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'admin'
        },
        body: JSON.stringify({ delivered })
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const fetchProductList = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts({ limit: 100 }); // Fetch more for admin list
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (sku) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(sku);
      fetchProductList(); // Refresh list
    } catch (err) {
      alert('Error deleting product');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!user || user.role !== 'admin') {
    return <div className="text-center py-16">Unauthorized</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.username}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b bg-white sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {['dashboard', 'orders', 'inventory', 'products'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-semibold border-b-2 transition ${activeTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && <div className="text-center py-8">Loading...</div>}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && summary && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-gray-600 text-sm mb-2">Total Orders</div>
                <div className="text-4xl font-bold text-indigo-600">{summary.orders.totalOrders}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-gray-600 text-sm mb-2">Delivered</div>
                <div className="text-4xl font-bold text-green-600">{summary.orders.deliveredOrders}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-gray-600 text-sm mb-2">Pending</div>
                <div className="text-4xl font-bold text-yellow-600">{summary.orders.pendingOrders}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-gray-600 text-sm mb-2">Total Revenue</div>
                <div className="text-4xl font-bold text-blue-600">₹{(summary.orders.totalRevenue).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
              </div>
            </div>

            {/* Inventory Summary */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Inventory Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border-l-4 border-indigo-600 pl-4">
                  <div className="text-gray-600 text-sm">Total Products</div>
                  <div className="text-3xl font-bold">{summary.inventory.totalProducts}</div>
                </div>
                <div className="border-l-4 border-yellow-600 pl-4">
                  <div className="text-gray-600 text-sm">Low Stock</div>
                  <div className="text-3xl font-bold text-yellow-600">{summary.inventory.lowStockCount}</div>
                </div>
                <div className="border-l-4 border-red-600 pl-4">
                  <div className="text-gray-600 text-sm">Out of Stock</div>
                  <div className="text-3xl font-bold text-red-600">{summary.inventory.outOfStockCount}</div>
                </div>
                <div className="border-l-4 border-green-600 pl-4">
                  <div className="text-gray-600 text-sm">Total Value</div>
                  <div className="text-3xl font-bold text-green-600">₹{(summary.inventory.totalInventory.totalValue).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Order Management</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Order ID</th>
                    <th className="px-6 py-3 text-left font-semibold">Customer</th>
                    <th className="px-6 py-3 text-left font-semibold">Total</th>
                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                    <th className="px-6 py-3 text-left font-semibold">Delivered</th>
                    <th className="px-6 py-3 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm font-mono">{order._id.substring(0, 8)}</td>
                      <td className="px-6 py-3 text-sm">{order.userId?.username || 'N/A'}</td>
                      <td className="px-6 py-3 text-sm font-bold">₹{(order.total).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <input
                          type="checkbox"
                          checked={order.delivered}
                          onChange={(e) => updateOrderStatus(order._id, e.target.checked)}
                          className="w-5 h-5 text-indigo-600"
                        />
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <button
                          onClick={() => updateOrderStatus(order._id, !order.delivered)}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          Toggle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Low Stock Alert</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {lowStockProducts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No low stock products</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">SKU</th>
                      <th className="px-6 py-3 text-left font-semibold">Product Name</th>
                      <th className="px-6 py-3 text-left font-semibold">Category</th>
                      <th className="px-6 py-3 text-left font-semibold">Stock</th>
                      <th className="px-6 py-3 text-left font-semibold">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {lowStockProducts.map(product => (
                      <tr key={product._id} className="hover:bg-gray-50 border-l-4 border-yellow-500">
                        <td className="px-6 py-3 text-sm font-mono font-bold">{product.sku}</td>
                        <td className="px-6 py-3 text-sm">{product.name}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{product.category}</td>
                        <td className="px-6 py-3 text-sm">
                          <span className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 font-bold">
                            {product.inventory?.stock || 0}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm font-bold">₹{(product.price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Product Management</h2>
              <button
                onClick={() => navigate('/admin/product/new')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
              >
                + Add Product
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">SKU</th>
                    <th className="px-6 py-3 text-left font-semibold">Name</th>
                    <th className="px-6 py-3 text-left font-semibold">Category</th>
                    <th className="px-6 py-3 text-left font-semibold">Price</th>
                    <th className="px-6 py-3 text-left font-semibold">Stock</th>
                    <th className="px-6 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map(product => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm font-mono font-bold">{product.sku}</td>
                      <td className="px-6 py-3 text-sm">{product.name}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-3 text-sm font-bold">₹{(product.price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                      <td className="px-6 py-3 text-sm">{product.inventory?.stock}</td>
                      <td className="px-6 py-3 text-sm flex gap-3">
                        <button
                          onClick={() => navigate(`/admin/product/edit/${product.sku}`)}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.sku)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
