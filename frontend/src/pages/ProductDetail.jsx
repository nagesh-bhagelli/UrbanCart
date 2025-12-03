import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct } from '../services/api';
import { useCart } from '../hooks/useCart';
import useInventorySSE from '../hooks/useInventorySSE';

export default function ProductDetail() {
  const { sku } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const liveProduct = useInventorySSE(sku);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct(sku).then(setProduct).catch(console.error);
  }, [sku]);

  useEffect(() => {
    // merge live updates
    if (liveProduct) setProduct(l => ({ ...l, ...liveProduct }));
  }, [liveProduct]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const maxStock = product?.inventory?.stock || 0;

  if (!product) return <div className="text-center py-16">Loading...</div>;

  return (
    <div className="max-w-2xl">
      <div className="bg-white shadow rounded-lg p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
          <div className="text-sm text-gray-600 mt-1">{product.category} • {product.brand}</div>
        </div>

        {product.specifications?.desc && (
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{product.specifications.desc}</p>
          </div>
        )}

        <div className="mb-6 pb-6 border-b">
          <div className="text-gray-600 text-sm">Price</div>
          <div className="text-2xl font-bold text-gray-900">₹{(product.price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
        </div>

        <div className="mb-6">
          <div className="text-gray-600 text-sm mb-2">Stock Available</div>
          <div className={`text-lg font-bold ${maxStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {maxStock > 0 ? `${maxStock} in stock` : 'Out of stock'}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              −
            </button>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(maxStock, parseInt(e.target.value) || 1)))}
              className="w-16 text-center border border-gray-300 rounded p-2"
              min="1"
              max={maxStock}
            />
            <button
              onClick={() => setQty(Math.min(maxStock, qty + 1))}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              disabled={qty >= maxStock}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
          >
            Back
          </button>
          <button
            onClick={handleAddToCart}
            disabled={maxStock === 0}
            className={`flex-1 px-6 py-3 text-white font-semibold rounded-lg transition ${added
                ? 'bg-green-500'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'
              } ${maxStock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {added ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
