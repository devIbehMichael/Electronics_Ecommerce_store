import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

const Cart = () => {
    const cart = useCartStore((state) => state.cart);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const getTotalPrice = useCartStore((state) => state.getTotalPrice);

    const totalPrice = getTotalPrice();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
                    <Link
                        to="/"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        {cart.map((item) => (
                            <div key={item.id} className="bg-white p-6 rounded-lg shadow-md mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                                        {item.images && item.images[0] ? (
                                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded" />
                                        ) : (
                                            <span className="text-gray-400 text-xs">No Image</span>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                        <p className="text-gray-600">₦{item.price?.toLocaleString()}</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="bg-gray-200 w-8 h-8 rounded hover:bg-gray-300"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="bg-gray-200 w-8 h-8 rounded hover:bg-gray-300"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
                            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₦{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="border-t pt-4 mb-6">
                                <div className="flex justify-between font-bold text-xl">
                                    <span>Total</span>
                                    <span>₦{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 font-bold"
                            >
                                Proceed to Checkout
                            </Link>

                            <Link
                                to="/"
                                className="block w-full text-center mt-4 text-blue-600 hover:underline"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
