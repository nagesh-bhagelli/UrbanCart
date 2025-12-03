import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchMyOrders } from '../services/api';

export default function MyOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadOrders();
        }
    }, [user]);

    const loadOrders = async () => {
        try {
            const data = await fetchMyOrders(user._id);
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
        setLoading(false);
    };

    if (loading) return <div className="text-center py-16">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                        You haven't placed any orders yet.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                                    <div>
                                        <div className="text-sm text-gray-500">Order ID</div>
                                        <div className="font-mono font-bold text-gray-700">{order._id}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">Date</div>
                                        <div className="font-medium text-gray-900">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4 mb-6">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center">
                                                <div>
                                                    <span className="font-medium text-gray-900">{item.sku}</span>
                                                    <span className="text-gray-500 ml-2">x {item.qty}</span>
                                                </div>
                                                <div className="text-gray-900">
                                                    ₹{(item.priceAtOrder * item.qty).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t pt-4 flex justify-between items-center">
                                        <div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="text-xl font-bold text-gray-900">
                                            Total: ₹{(order.total).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
