import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { createProduct, updateProduct, fetchProduct } from '../services/api';

export default function AdminProductForm() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const isEdit = !!sku;

  const [form, setForm] = useState({
    sku: '', name: '', category: '', brand: '', price: 0, image: '',
    inventory: { stock: 0, warehouse: 'WH-1' }, specifications: '{}', attributes: '{}'
  });

  useEffect(() => {
    if (isEdit) {
      loadProduct();
    }
  }, [sku]);

  const loadProduct = async () => {
    try {
      const data = await fetchProduct(sku);
      setForm({
        sku: data.sku,
        name: data.name,
        category: data.category,
        brand: data.brand,
        image: data.image || '',
        price: data.price,
        inventory: data.inventory || { stock: 0, warehouse: 'WH-1' },
        specifications: JSON.stringify(data.specifications || {}, null, 2),
        attributes: JSON.stringify(data.attributes || {}, null, 2)
      });
    } catch (err) {
      alert('Error loading product');
      navigate('/admin/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(form.price) <= 0) {
      alert("Price must be greater than 0");
      return;
    }
    if (Number(form.inventory.stock) <= 0) {
      alert("Stock must be greater than 0");
      return;
    }

    let parsedSpecs = {};
    let parsedAttrs = {};

    try {
      parsedSpecs = JSON.parse(form.specifications);
    } catch (err) {
      alert("Invalid JSON in Specifications field");
      return;
    }

    try {
      parsedAttrs = JSON.parse(form.attributes);
    } catch (err) {
      alert("Invalid JSON in Attributes field");
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      inventory: {
        ...form.inventory,
        stock: Number(form.inventory.stock)
      },
      specifications: parsedSpecs,
      attributes: parsedAttrs
    };
    try {
      if (isEdit) {
        await updateProduct(sku, payload);
        alert('Updated successfully');
      } else {
        await createProduct(payload);
        alert('Created successfully');
      }
      navigate('/admin/dashboard', { state: { tab: 'products' } });
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit Product' : 'Create New Product'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Stock Keeping Unit)</label>
                <input
                  type="text"
                  placeholder="e.g., PRD-001"
                  value={form.sku}
                  onChange={e => setForm({ ...form, sku: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition disabled:bg-gray-100 disabled:text-gray-500"
                  disabled={isEdit}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g., Wireless Headphones"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g., Electronics"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  type="text"
                  placeholder="e.g., Sony"
                  value={form.brand}
                  onChange={e => setForm({ ...form, brand: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="e.g., https://example.com/image.jpg"
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </div>
          </section>

          {/* Pricing & Inventory */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Pricing & Inventory</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.inventory.stock}
                  onChange={e => setForm({ ...form, inventory: { ...form.inventory, stock: e.target.value } })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  required
                />
              </div>
            </div>
          </section>

          {/* Advanced Details */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Advanced Details</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Specifications (JSON)</label>
                  <span className="text-xs text-gray-500">Key-value pairs for technical specs</span>
                </div>
                <textarea
                  value={form.specifications}
                  onChange={e => setForm({ ...form, specifications: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition h-32 font-mono text-sm bg-gray-50"
                  placeholder='{ "Color": "Black", "Weight": "200g" }'
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Attributes (JSON)</label>
                  <span className="text-xs text-gray-500">Selectable options like size or color</span>
                </div>
                <textarea
                  value={form.attributes}
                  onChange={e => setForm({ ...form, attributes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition h-32 font-mono text-sm bg-gray-50"
                  placeholder='{ "size": ["S", "M", "L"] }'
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-md hover:shadow-lg transition"
            >
              {isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
