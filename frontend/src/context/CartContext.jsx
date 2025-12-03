import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.sku === product.sku);
      if (existing) {
        return prev.map(item =>
          item.sku === product.sku
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (sku) => {
    setItems(prev => prev.filter(item => item.sku !== sku));
  };

  const updateQty = (sku, qty) => {
    if (qty <= 0) {
      removeFromCart(sku);
    } else {
      setItems(prev =>
        prev.map(item =>
          item.sku === sku ? { ...item, qty } : item
        )
      );
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}
