import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

export default function ProductCard({ p }) {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const navigate = useNavigate();

  // Generate a consistent color-coded image based on SKU
  const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];
  const colorIndex = (p.sku.charCodeAt(p.sku.length - 1)) % colors.length;
  const bgColor = colors[colorIndex];

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(p, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div
      onClick={() => navigate(`/products/${p.sku}`)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer"
    >
      {/* Product Image Placeholder */}
      {/* Product Image */}
      <div className="h-48 relative overflow-hidden bg-gray-100">
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center bg-gradient-to-br"
            style={{ backgroundColor: bgColor, opacity: 0.9 }}
          >
            <div className="text-white text-center">
              <div className="text-6xl font-bold opacity-50">{p.category.charAt(0)}</div>
              <div className="text-sm font-semibold mt-2">{p.category}</div>
            </div>
          </div>
        )}
        {p.inventory?.stock < 20 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
            Low Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-gray-800 line-clamp-2 mb-2">{p.name}</h3>

        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{p.specifications?.desc}</p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">{p.brand}</span>
          <span className="text-xs text-gray-500">{p.category}</span>
        </div>

        {/* Price and Stock */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-1 mb-2">
            <div className="text-2xl font-bold text-gray-900">₹{(p.price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className={`text-sm font-semibold ${p.inventory?.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {p.inventory?.stock > 0 ? `${p.inventory?.stock} in stock` : 'Out of stock'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link
              to={`/products/${p.sku}`}
              className="flex-1 text-center px-3 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              View
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={p.inventory?.stock <= 0}
              className={`flex-1 px-3 py-2 font-semibold rounded-lg transition ${addedToCart
                ? 'bg-green-500 text-white'
                : p.inventory?.stock <= 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                }`}
            >
              {addedToCart ? '✓ Added' : 'Add Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
