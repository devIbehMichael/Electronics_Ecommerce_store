import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaystackButton } from 'react-paystack';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import useCartStore from '../store/cartStore';

const Checkout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const cart = useCartStore((state) => state.cart);
    const getTotalPrice = useCartStore((state) => state.getTotalPrice);
    const clearCart = useCartStore((state) => state.clearCart);

    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    // Use state for reference to ensure it stays constant during re-renders
    const [reference] = useState(`ref_${new Date().getTime()}`);

    const totalPrice = getTotalPrice();

    const onSuccess = async (reference) => {
        console.log('✅ Paystack onSuccess fired!', reference);

        try {
            // Verify user is logged in
            if (!user || !user.id) {
                throw new Error('User not authenticated. Please log in and try again.');
            }

            console.log('💾 Attempting to save order to database...');

            // Save order to database
            const { data, error } = await supabase.from('orders').insert({
                user_id: user.id,
                items: cart,
                total_price: totalPrice,
                payment_status: 'completed',
                order_status: 'pending',
            }).select();

            if (error) {
                console.error('❌ Database error:', error);
                throw error;
            }

            console.log('✅ Order saved successfully!', data);

            // Clear cart and redirect
            clearCart();
            alert('Payment successful! Your order has been placed.');
            navigate('/');
        } catch (error) {
            console.error('❌ Error in onSuccess:', error);
            alert(`Error: ${error.message || 'Failed to save order.'}`);
        }
    };

    const onClose = () => {
        console.log('⚠️ Payment closed/cancelled');
        alert('Payment cancelled');
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    const componentProps = {
        email,
        amount: totalPrice * 100,
        metadata: {
            name: user?.user_metadata?.full_name || email,
            phone,
        },
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        text: `Pay ₦${totalPrice.toLocaleString()}`,
        onSuccess: (reference) => onSuccess(reference),
        onClose: onClose,
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Checkout Form */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6">Billing Information</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border p-3 rounded"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full border p-3 rounded"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Delivery Address</label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full border p-3 rounded"
                                    rows="3"
                                    required
                                />
                            </div>

                            <PaystackButton
                                {...componentProps}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold"
                            />

                            {/* Debug Button - Only for testing */}
                            <button
                                type="button"
                                onClick={() => onSuccess({ reference: `debug_${new Date().getTime()}` })}
                                className="w-full mt-4 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 text-sm"
                            >
                                🛠️ Debug: Simulate Successful Payment
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between">
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between font-bold text-xl mb-2">
                                <span>Total</span>
                                <span>₦{totalPrice.toLocaleString()}</span>
                            </div>
                            <p className="text-gray-600 text-sm">Payment will be processed securely via Paystack</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
