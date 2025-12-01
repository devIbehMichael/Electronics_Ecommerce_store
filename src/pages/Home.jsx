import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import useCartStore from '../store/cartStore';
import HeroSlider from '../components/HeroSlider';
import CategorySection from '../components/CategorySection';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const addToCart = useCartStore((state) => state.addToCart);

    const searchTerm = searchParams.get('search') || '';
    const selectedCategory = searchParams.get('category') || '';

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
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category?.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    const handleAddToCart = (product) => {
        addToCart(product);
        alert('Added to cart!');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-6">
                {/* Hero Banner Slider */}
                <HeroSlider />

                {/* Popular Categories */}
                <CategorySection />

                {/* Products Section */}
                <div className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products` : 'All Products'}
                        </h2>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-xl">No products found</p>
                            <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
                                View all products
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                                >
                                    <Link to={`/product/${product.id}`}>
                                        <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                                            {product.images && product.images[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                                />
                                            ) : (
                                                <div className="text-gray-300 text-4xl">📦</div>
                                            )}
                                        </div>
                                    </Link>

                                    <div className="p-4">
                                        <Link to={`/product/${product.id}`}>
                                            <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2 hover:text-blue-600">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        <div className="mt-3 flex items-center justify-between">
                                            <p className="text-lg font-bold text-gray-900">
                                                ₦{product.price?.toLocaleString()}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.stock <= 0}
                                            className={`mt-3 w-full py-2 px-4 rounded-lg text-sm font-medium transition ${product.stock > 0
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                }`}
                                        >
                                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
