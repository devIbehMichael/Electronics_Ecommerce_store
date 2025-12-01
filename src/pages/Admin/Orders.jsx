import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ order_status: newStatus })
                .eq('id', orderId);

            if (error) throw error;
            alert('Order status updated!');
            fetchOrders();
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Error updating order status');
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Order Management</h1>

                {orders.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <p className="text-gray-600">No orders yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold">Order #{order.id.substring(0, 8)}</h3>
                                        <p className="text-gray-600">
                                            Date: {new Date(order.created_at).toLocaleString()}
                                        </p>
                                        <p className="text-gray-600">
                                            Payment Status: <span className="font-semibold">{order.payment_status}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-blue-600">
                                            ₦{parseFloat(order.total_price).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="font-bold mb-2">Items:</h4>
                                    <div className="space-y-2">
                                        {order.items?.map((item, index) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span>{item.name} (x{item.quantity})</span>
                                                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="font-semibold">Order Status:</label>
                                    <select
                                        value={order.order_status}
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                        className="border p-2 rounded"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
