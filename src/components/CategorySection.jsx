import { Link } from 'react-router-dom';

const CategorySection = () => {
    const categories = [
        {
            name: 'Smartphones',
            icon: '📱',
            link: '/?category=smartphones',
            bgColor: 'bg-blue-50'
        },
        {
            name: 'Laptops',
            icon: '💻',
            link: '/?category=laptops',
            bgColor: 'bg-purple-50'
        },
        {
            name: 'Headphones',
            icon: '🎧',
            link: '/?category=headphones',
            bgColor: 'bg-pink-50'
        },
        {
            name: 'Cameras',
            icon: '📷',
            link: '/?category=cameras',
            bgColor: 'bg-green-50'
        },
        {
            name: 'Gaming',
            icon: '🎮',
            link: '/?category=gaming',
            bgColor: 'bg-red-50'
        },
        {
            name: 'Tablets',
            icon: '📲',
            link: '/?category=tablets',
            bgColor: 'bg-indigo-50'
        },
        {
            name: 'Smartwatches',
            icon: '⌚',
            link: '/?category=smartwatches',
            bgColor: 'bg-yellow-50'
        },
        {
            name: 'TVs',
            icon: '📺',
            link: '/?category=tvs',
            bgColor: 'bg-cyan-50'
        },
        {
            name: 'Accessories',
            icon: '🔌',
            link: '/?category=accessories',
            bgColor: 'bg-orange-50'
        }
    ];

    return (
        <div className="my-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Explore Electronics Categories</h2>
                <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                    View All →
                </Link>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map((category) => (
                    <Link
                        key={category.name}
                        to={category.link}
                        className="flex-shrink-0 text-center group"
                    >
                        <div
                            className={`w-24 h-24 rounded-full ${category.bgColor} flex items-center justify-center text-4xl mb-3 group-hover:scale-110 transition-transform`}
                        >
                            {category.icon}
                        </div>
                        <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                            {category.name}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategorySection;
