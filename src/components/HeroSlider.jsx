import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: 'iPhone 16 Pro Max',
            subtitle: 'From ₦ 1,200,000*',
            description: 'A18 Pro Chip. Camera Control. 4K Dolby Vision at 120 fps.',
            buttonText: 'Shop Now',
            bgColor: 'bg-gradient-to-br from-blue-900 to-purple-900',
            textColor: 'text-white',
            link: '/?category=smartphones'
        },
        {
            id: 2,
            title: 'Gaming Consoles',
            subtitle: 'Up to 30% Off',
            description: 'Latest PlayStation, Xbox, and Nintendo Switch deals',
            buttonText: 'Shop Gaming',
            bgColor: 'bg-gradient-to-br from-red-600 to-pink-600',
            textColor: 'text-white',
            link: '/?category=gaming'
        },
        {
            id: 3,
            title: 'Premium Laptops',
            subtitle: 'Starting from ₦ 350,000',
            description: 'MacBook, Dell, HP, Lenovo - Best prices guaranteed',
            buttonText: 'Shop Laptops',
            bgColor: 'bg-gradient-to-br from-gray-800 to-gray-600',
            textColor: 'text-white',
            link: '/?category=laptops'
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
                    <div className="container mx-auto px-8 h-full flex items-center">
                        <div className={`max-w-2xl ${slide.textColor}`}>
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
                    </div>
                </div>
            ))}

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
