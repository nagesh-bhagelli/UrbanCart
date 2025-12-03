import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const api = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
};

export default function CartPage() {
  const { items, updateQty, removeFromCart, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const orderItems = items.map(item => ({
        sku: item.sku,
        qty: item.qty,
      }));

      const res = await fetch(`${api.baseURL}/orders`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          userId: user?._id || null,
          items: orderItems,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');

      alert(`Order placed successfully! Order ID: ${data.data._id}`);
      clearCart();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Add some products to get started!</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Shopping Cart</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-600">
          {error}
        </div>
      )}

      {/* Cart Items */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-4 font-semibold text-gray-700">Product</th>
                <th className="text-left p-4 font-semibold text-gray-700">Price</th>
                <th className="text-left p-4 font-semibold text-gray-700">Quantity</th>
                <th className="text-left p-4 font-semibold text-gray-700">Total</th>
                <th className="text-left p-4 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.sku} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-semibold text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.sku}</div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-gray-800">₹{(item.price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.sku, item.qty - 1)}
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateQty(item.sku, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 text-center border rounded p-1"
                        min="1"
                      />
                      <button
                        onClick={() => updateQty(item.sku, item.qty + 1)}
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-gray-900">₹{(item.price * item.qty).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                  <td className="p-4">
                    <button
                      onClick={() => removeFromCart(item.sku)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span>₹{(totalPrice).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-xl font-bold text-gray-900">
            <span>Total:</span>
            <span className="text-green-600">₹{(totalPrice).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
        >
          Continue Shopping
        </button>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Checkout & Place Order'}
        </button>
      </div>
    </div>
  );
}
