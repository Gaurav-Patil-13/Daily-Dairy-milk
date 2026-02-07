import { Link } from 'react-router-dom';
import { Milk, Clock, Shield, Truck, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <Milk className="w-8 h-8" />,
      title: 'Fresh & Pure',
      description: 'Premium quality milk delivered fresh every morning'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Daily Delivery',
      description: 'Reliable doorstep delivery, 7 days a week'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Flexible Plans',
      description: 'Pause or skip deliveries with just one click'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Quality Assured',
      description: '100% pure milk with rigorous quality checks'
    }
  ];

  const milkTypes = [
    {
      type: 'Cow Milk',
      price: '₹60/L',
      features: ['Low fat content', 'Rich in vitamins', 'Light & easily digestible']
    },
    {
      type: 'Buffalo Milk',
      price: '₹70/L',
      features: ['High fat content', 'Creamy texture', 'Rich in calcium']
    },
    {
      type: 'Mixed Milk',
      price: '₹65/L',
      features: ['Balanced nutrition', 'Perfect blend', 'Best of both worlds']
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dairy-500 via-dairy-600 to-cyan-600 text-white py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTAgMTJjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTEyIDBjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iLjUiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-slide-in">
            <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <Milk className="w-16 h-16" />
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Fresh Milk, Delivered Daily
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-dairy-50 max-w-2xl mx-auto">
              Premium quality milk from our farm to your doorstep. Subscribe now and never run out of fresh milk again.
            </p>
            
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-white text-dairy-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                >
                  Login
                </Link>
              </div>
            ) : (
              <Link
                to={user.role === 'seller' ? '/seller/dashboard' : '/customer/dashboard'}
                className="inline-block px-8 py-4 bg-white text-dairy-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-display font-bold text-center mb-12 text-gray-800">
            Why Choose Us?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-hover p-6 text-center group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-dairy-100 to-cyan-100 text-dairy-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milk Types Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-display font-bold text-center mb-4 text-gray-800">
            Our Premium Milk Selection
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Choose from our range of fresh, quality-tested milk varieties
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {milkTypes.map((milk, index) => (
              <div
                key={index}
                className="card p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-dairy-400 to-dairy-600 text-white rounded-full mb-4">
                    <Milk className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-gray-800 mb-2">
                    {milk.type}
                  </h3>
                  <p className="text-3xl font-bold text-dairy-600">{milk.price}</p>
                </div>
                
                <div className="space-y-3">
                  {milk.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-dairy-500 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold mb-6">
            Ready to Start Your Subscription?
          </h2>
          <p className="text-xl mb-8 text-dairy-50">
            Join thousands of happy customers enjoying fresh milk every day
          </p>
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-white text-dairy-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Subscribe Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;