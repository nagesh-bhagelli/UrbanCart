import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useCart } from './hooks/useCart';

export default function App() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            UrbanCart
          </Link>
          <nav className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/cart"
                  className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
                >
                  🛒
                  {items.length > 0 && (
                    <span className="absolute top-0 right-0 -translate-y-2 translate-x-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </Link>
                <Link
                  to="/my-orders"
                  className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-semibold transition"
                >
                  My Orders
                </Link>
                <span className="text-gray-700 font-medium">Welcome, <span className="text-indigo-600">{user.username}</span></span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                >
                  Sign Out
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
