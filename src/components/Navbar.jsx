import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useCartStore from '../store/cartStore';
import { useState } from 'react';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const cart = useCartStore((state) => state.cart);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/?search=${searchTerm}`);
    };

    // Updated admin detection to use app_metadata.role as per requirements
    const isAdmin = user?.app_metadata?.role === 'admin';

    const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="bg-white shadow-sm sticky top-0 z-50">
            {/* Main Navbar */}
            <div className="border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="text-2xl font-bold">
                                <span className="text-gray-800">e</span>
                                <span className="text-blue-600">max</span>
                            </div>
                        </Link>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for any electronics product..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </form>

                        {/* Right Side Icons */}
                        <div className="flex items-center space-x-6">
                            {/* Location Dropdown */}
                            <div className="hidden md:flex items-center space-x-1 text-sm">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-gray-700">Nigeria</span>
                            </div>

                            {/* User Icon */}
                            {user ? (
                                <div className="relative group">
                                    <button className="flex items-center space-x-1 text-sm hover:text-blue-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                            {user.email}
                                        </div>
                                        {isAdmin && (
                                            <Link
                                                to="/admin/dashboard"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="flex items-center space-x-1 text-sm hover:text-blue-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Sign In</span>
                                </Link>
                            )}

                            {/* Cart Icon */}
                            <Link to="/cart" className="relative hover:text-blue-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {totalCartItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {totalCartItems}
                                    </span>
                                )}
                            </Link>

                            {/* Sign In Button (if not logged in) */}
                            {!user && (
                                <Link
                                    to="/login"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Bar - Electronics Categories */}
            <div className="border-b bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center space-x-6 h-12 overflow-x-auto">
                        <Link to="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap">
                            All Products
                        </Link>
                        <Link to="/?category=smartphones" className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
                            Smartphones
                        </Link>
                        <Link to="/?category=laptops" className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
                            Laptops
                        </Link>
                        <Link to="/?category=headphones" className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
                            Headphones
                        </Link>
                        <Link to="/?category=cameras" className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
                            Cameras
                        </Link>
                        <Link to="/?category=gaming" className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
                            Gaming
                        </Link>
                        <Link to="/?category=tablets" className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
                            Tablets
                        </Link>
                        <Link to="/?category=smartwatches" className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
                            Smartwatches
                        </Link>
                        <Link to="/?category=tvs" className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
                            TVs
                        </Link>
                        <Link to="/?category=accessories" className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap">
                            Accessories
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
