import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';

const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [prices, setPrices] = useState({
        iphone: '1,200,000',
        laptop: '350,000',
        gaming: '650,000'
    });

    useEffect(() => {
        fetchDynamicPrices();
    }, []);

    const fetchDynamicPrices = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('name, price, category');

            if (error) throw error;

            if (data) {
                const newPrices = { ...prices };

                // Find iPhone price
                const iphone = data.find(p => p.name.includes('iPhone') || p.category === 'smartphones');
                if (iphone) newPrices.iphone = parseFloat(iphone.price).toLocaleString();

                // Find Laptop price (cheapest or specific)
                const laptop = data.find(p => p.category === 'laptops');
                if (laptop) newPrices.laptop = parseFloat(laptop.price).toLocaleString();

                // Find Gaming price
                const gaming = data.find(p => p.category === 'gaming');
                if (gaming) newPrices.gaming = parseFloat(gaming.price).toLocaleString();

                setPrices(newPrices);
            }
        } catch (error) {
            console.error('Error fetching prices:', error);
        }
    };

    const slides = [
        {
            id: 1,
            title: 'iPhone 16 Pro Max',
            subtitle: `From ₦ ${prices.iphone}*`,
            description: 'A18 Pro Chip. Camera Control. 4K Dolby Vision at 120 fps.',
            buttonText: 'Shop Now',
            bgColor: 'bg-gradient-to-br from-blue-900 to-purple-900',
            textColor: 'text-white',
            link: '/?category=smartphones',
            image: '/hero/iphone.png'
        },
        {
            id: 2,
            title: 'Gaming Consoles',
            subtitle: 'Up to 30% Off',
            description: `Latest PlayStation 5 starting at ₦ ${prices.gaming}`,
            buttonText: 'Shop Gaming',
            bgColor: 'bg-gradient-to-br from-red-600 to-pink-600',
            textColor: 'text-white',
            link: '/?category=gaming',
            image: '/hero/gaming.png'
        },
        {
            id: 3,
            title: 'Premium Laptops',
            subtitle: `Starting from ₦ ${prices.laptop}`,
            description: 'MacBook, Dell, HP, Lenovo - Best prices guaranteed',
            buttonText: 'Shop Laptops',
            bgColor: 'bg-gradient-to-br from-gray-800 to-gray-600',
            textColor: 'text-white',
            link: '/?category=laptops',
            image: '/hero/laptop.png'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        } ${slide.bgColor}`}
                >
                    <div className="container mx-auto px-8 h-full flex items-center justify-between">
                        {/* Left Side - Text Content */}
                        <div className={`max-w-xl ${slide.textColor} z-10`}>
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                            <p className="text-2xl md:text-3xl font-semibold mb-2">{slide.subtitle}</p>
                            <p className="text-lg mb-6 opacity-90">{slide.description}</p>
                            <Link
                                to={slide.link}
                                className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
                            >
                                {slide.buttonText}
                            </Link>
                            <p className="text-sm mt-4 opacity-75">*exc. All VAT Offers</p>
                        </div>

                        {/* Right Side - Product Image */}
                        <div className="hidden md:flex items-center justify-end flex-1 h-full">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="h-full object-contain drop-shadow-2xl p-4 max-h-80"
                            />
                        </div>
                    </div>
                </div>
            ))}

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;
