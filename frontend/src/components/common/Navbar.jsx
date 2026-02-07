import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Milk, LogOut, User, Home } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-dairy-400 to-dairy-600 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <Milk className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-dairy-600 to-dairy-800 bg-clip-text text-transparent">
              Fresh Dairy
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={user.role === 'seller' ? '/seller/dashboard' : '/customer/dashboard'}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-dairy-50 transition-all duration-200"
                >
                  <Home className="w-4 h-4" />
                  <span className="font-medium">Dashboard</span>
                </Link>

                <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-dairy-50 to-cyan-50 rounded-xl">
                  <User className="w-4 h-4 text-dairy-600" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">{user.role}</span>
                    <span className="text-sm font-medium text-gray-800">{user.name}</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 text-dairy-600 font-medium hover:bg-dairy-50 rounded-xl transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;