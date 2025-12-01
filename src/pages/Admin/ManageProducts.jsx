import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: [],
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                stock: parseInt(formData.stock),
                images: formData.images.split(',').map(url => url.trim()).filter(url => url),
            };

            // Debug: Check user role before operation
            const { data: { user } } = await supabase.auth.getUser();
            console.log('👤 Current User Role:', user?.app_metadata?.role);

            if (editingProduct) {
                console.log('📝 Updating product:', editingProduct.id, productData);

                // Update existing product
                const { data, error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingProduct.id)
                    .select();

                if (error) throw error;

                if (data.length === 0) {
                    throw new Error('Update failed! No rows affected. Check if you have admin permissions.');
                }

                console.log('✅ Update successful:', data);
                alert('Product updated successfully!');
            } else {
                // Add new product
                const { data, error } = await supabase
                    .from('products')
                    .insert([productData])
                    .select();

                if (error) throw error;
                console.log('✅ Insert successful:', data);
                alert('Product added successfully!');
            }

            setShowModal(false);
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                stock: '',
                images: [],
            });
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product: ' + error.message);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            category: product.category || '',
            stock: product.stock || 0,
            images: product.images ? product.images.join(', ') : '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            alert('Product deleted successfully!');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Manage Products</h1>
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            setFormData({
                                name: '',
                                description: '',
                                price: '',
                                category: '',
                                stock: '',
                                images: '',
                            });
                            setShowModal(true);
                        }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Add New Product
                    </button>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="text-left p-4">Name</th>
                                <th className="text-left p-4">Category</th>
                                <th className="text-left p-4">Price</th>
                                <th className="text-left p-4">Stock</th>
                                <th className="text-left p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">{product.name}</td>
                                    <td className="p-4">{product.category || 'N/A'}</td>
                                    <td className="p-4">₦{parseFloat(product.price).toLocaleString()}</td>
                                    <td className="p-4">{product.stock}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="text-blue-600 hover:underline mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border p-3 rounded"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full border p-3 rounded"
                                        rows="3"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">Price (₦)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full border p-3 rounded"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2">Stock</label>
                                        <input
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            className="w-full border p-3 rounded"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Category</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full border p-3 rounded"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-2">Image URLs (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={formData.images}
                                        onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                                        className="w-full border p-3 rounded"
                                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                                    >
                                        {editingProduct ? 'Update Product' : 'Add Product'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingProduct(null);
                                        }}
                                        className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageProducts;
