import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchRecentOrders();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch total revenue and orders
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('total_price');

            if (ordersError) throw ordersError;

            const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);

            // Fetch total products
            const { count: productCount, error: productsError } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            if (productsError) throw productsError;

            setStats({
                totalRevenue,
                totalOrders: orders.length,
                totalProducts: productCount || 0,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchRecentOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;
            setRecentOrders(data || []);
        } catch (error) {
            console.error('Error fetching recent orders:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-gray-600 mb-2">Total Revenue</h3>
                        <p className="text-3xl font-bold text-green-600">₦{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-gray-600 mb-2">Total Orders</h3>
                        <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-gray-600 mb-2">Total Products</h3>
                        <p className="text-3xl font-bold text-purple-600">{stats.totalProducts}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                    <div className="flex gap-4">
                        <Link
                            to="/admin/products"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                        >
                            Manage Products
                        </Link>
                        <Link
                            to="/admin/orders"
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                        >
                            View Orders
                        </Link>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
                    {recentOrders.length === 0 ? (
                        <p className="text-gray-600">No orders yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2">Order ID</th>
                                        <th className="text-left py-2">Total</th>
                                        <th className="text-left py-2">Status</th>
                                        <th className="text-left py-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="border-b">
                                            <td className="py-2">{order.id.substring(0, 8)}...</td>
                                            <td className="py-2">₦{parseFloat(order.total_price).toLocaleString()}</td>
                                            <td className="py-2">
                                                <span className={`px-2 py-1 rounded text-sm ${order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.order_status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.order_status}
                                                </span>
                                            </td>
                                            <td className="py-2">{new Date(order.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
