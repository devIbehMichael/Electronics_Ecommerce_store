import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import useCartStore from '../store/cartStore';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        alert(`Added ${quantity} item(s) to cart!`);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-blue-600 hover:underline"
                >
                    ← Back to Products
                </button>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* Product Image */}
                        <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                            {product.images && product.images[0] ? (
                                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover rounded-lg" />
                            ) : (
                                <span className="text-gray-400 text-xl">No Image</span>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                            <p className="text-gray-600 mb-6">{product.description}</p>

                            <div className="mb-6">
                                <span className="text-4xl font-bold text-blue-600">₦{product.price?.toLocaleString()}</span>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-700 mb-2">
                                    <strong>Category:</strong> {product.category || 'N/A'}
                                </p>
                                <p className={`text-gray-700 ${product.stock <= 0 ? 'text-red-500' : ''}`}>
                                    <strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
                                </p>
                            </div>

                            {product.stock > 0 && (
                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={product.stock}
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                        className="border p-2 rounded w-24"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className={`w-full py-3 rounded-lg font-bold text-white ${product.stock > 0
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
