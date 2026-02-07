import { useState, useEffect } from 'react';
import { subscriptionAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Users, Calendar, Package, TrendingUp, Milk, PauseCircle, 
  CheckCircle, Phone, Mail, MapPin 
} from 'lucide-react';
import { formatDate, formatCurrency, getMilkTypeName } from '../../utils/helpers';
import Loading from '../../components/common/Loading';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [todaySummary, setTodaySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subsResponse, summaryResponse] = await Promise.all([
        subscriptionAPI.getAll(),
        subscriptionAPI.getTodaySummary()
      ]);
      
      setSubscriptions(subsResponse.data);
      setTodaySummary(summaryResponse.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading seller dashboard..." />;
  }

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  const totalRevenue = subscriptions.reduce((sum, sub) => {
    return sum + (sub.pricePerLiter * sub.quantity * sub.totalDays);
  }, 0);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-slide-in">
          <h1 className="text-4xl font-display font-bold text-gray-800 mb-2">
            Seller Dashboard
          </h1>
          <p className="text-gray-600">Manage your customers and deliveries</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Customers */}
          <div className="card-hover p-6 animate-slide-in">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="badge-info">Active</span>
            </div>
            <p className="text-gray-500 text-sm mb-1">Total Customers</p>
            <p className="text-3xl font-bold text-gray-800">{activeSubscriptions.length}</p>
          </div>

          {/* Today's Deliveries */}
          <div className="card-hover p-6 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="badge-success">Delivering</span>
            </div>
            <p className="text-gray-500 text-sm mb-1">Today's Deliveries</p>
            <p className="text-3xl font-bold text-gray-800">
              {todaySummary?.totalDeliveries || 0}
            </p>
          </div>

          {/* Paused Today */}
          <div className="card-hover p-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl">
                <PauseCircle className="w-6 h-6 text-white" />
              </div>
              <span className="badge-warning">Paused</span>
            </div>
            <p className="text-gray-500 text-sm mb-1">Paused Today</p>
            <p className="text-3xl font-bold text-gray-800">
              {todaySummary?.totalPaused || 0}
            </p>
          </div>

          {/* Total Revenue */}
          <div className="card-hover p-6 animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="badge bg-purple-100 text-purple-800">Revenue</span>
            </div>
            <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-800">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>

        {/* Today's Summary Card */}
        {todaySummary && (
          <div className="card p-6 mb-8 animate-slide-in">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-dairy-400 to-dairy-600 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-800">
                  Today's Delivery Summary
                </h2>
                <p className="text-gray-600">{formatDate(todaySummary.date)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Milk Type Breakdown */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Milk className="w-5 h-5 mr-2 text-dairy-600" />
                  Milk Requirements
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cow Milk:</span>
                    <span className="font-bold text-gray-800">
                      {todaySummary.milkTypeTotals?.cow || 0}L
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Buffalo Milk:</span>
                    <span className="font-bold text-gray-800">
                      {todaySummary.milkTypeTotals?.buffalo || 0}L
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Mixed Milk:</span>
                    <span className="font-bold text-gray-800">
                      {todaySummary.milkTypeTotals?.mixed || 0}L
                    </span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-gray-300 flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Total:</span>
                    <span className="font-bold text-xl text-dairy-600">
                      {(todaySummary.milkTypeTotals?.cow || 0) + 
                       (todaySummary.milkTypeTotals?.buffalo || 0) + 
                       (todaySummary.milkTypeTotals?.mixed || 0)}L
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Stats */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Delivery Status
                </h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {todaySummary.totalDeliveries}
                    </div>
                    <div className="text-sm text-gray-600">Active Deliveries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">
                      {todaySummary.totalPaused}
                    </div>
                    <div className="text-sm text-gray-600">Paused Deliveries</div>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-purple-600" />
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Subs:</span>
                    <span className="font-bold text-gray-800">
                      {activeSubscriptions.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery Rate:</span>
                    <span className="font-bold text-gray-800">
                      {todaySummary.totalDeliveries > 0 
                        ? Math.round((todaySummary.totalDeliveries / (todaySummary.totalDeliveries + todaySummary.totalPaused)) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'today'
                ? 'bg-dairy-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Today's Deliveries
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-dairy-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Customers
          </button>
        </div>

        {/* Customers List */}
        <div className="card overflow-hidden animate-slide-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-dairy-50 to-cyan-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Paused Days
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(activeTab === 'today' ? todaySummary?.delivering || [] : activeSubscriptions).map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-dairy-400 to-dairy-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {sub.customer?.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {sub.customer?.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {sub.customer?.email || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center text-gray-800 mb-1">
                          <Phone className="w-3 h-3 mr-2 text-gray-400" />
                          {sub.customer?.phone || 'N/A'}
                        </div>
                        <div className="flex items-start text-gray-600">
                          <MapPin className="w-3 h-3 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{sub.customer?.address || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Milk className="w-4 h-4 text-dairy-600" />
                        <div>
                          <div className="font-medium text-gray-800">
                            {getMilkTypeName(sub.milkType)}
                          </div>
                          <div className="text-sm text-gray-600">{sub.quantity}L/day</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-800 font-medium">{sub.totalDays} days</div>
                        <div className="text-gray-600">
                          {formatDate(sub.startDate)} - {formatDate(sub.endDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge-warning">
                        {sub.pausedDates?.length || 0} days
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${
                        sub.status === 'active' ? 'badge-success' :
                        sub.status === 'completed' ? 'badge-info' :
                        'badge-danger'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(activeTab === 'today' ? todaySummary?.delivering?.length === 0 : activeSubscriptions.length === 0) && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No subscriptions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;