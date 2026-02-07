import { useState, useEffect } from 'react';
import { subscriptionAPI } from '../utils/api.js';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Milk, Calendar, PauseCircle, PlayCircle, Plus, 
  CheckCircle, XCircle, Package, DollarSign 
} from 'lucide-react';
import { formatDate, formatCurrency, getMilkTypeName, checkIsToday } from '../utils/helpers';
import CreateSubscriptionModal from '../components/customer/CreateSubscriptionModal';
import SubscriptionCalendar from '../components/customer/SubscriptionCalendar';
import Loading from '../components/common/Loading';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchActiveSubscription();
  }, []);

  const fetchActiveSubscription = async () => {
    try {
      const { data } = await subscriptionAPI.getActive();
      setSubscription(data);
    } catch (error) {
      // No active subscription
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePauseToday = async () => {
    if (!subscription) return;
    
    setToggling(true);
    try {
      const { data } = await subscriptionAPI.togglePause(subscription._id, {
        date: new Date()
      });
      setSubscription(data.subscription);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle pause');
    } finally {
      setToggling(false);
    }
  };

  const handleSubscriptionCreated = (newSubscription) => {
    setSubscription(newSubscription);
    setShowCreateModal(false);
    toast.success('Subscription created successfully!');
  };

  if (loading) {
    return <Loading message="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-slide-in">
          <h1 className="text-4xl font-display font-bold text-gray-800 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600">Manage your milk subscription and delivery preferences</p>
        </div>

        {!subscription ? (
          // No Active Subscription
          <div className="card p-12 text-center animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-dairy-100 to-cyan-100 rounded-full mb-6">
                <Package className="w-16 h-16 text-dairy-600" />
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">
                No Active Subscription
              </h2>
              <p className="text-gray-600 mb-8">
                Start your fresh milk delivery subscription today and enjoy premium quality milk delivered to your doorstep every morning.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Subscription</span>
              </button>
            </div>
          </div>
        ) : (
          // Active Subscription
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="card p-6 animate-slide-in">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-display font-bold text-gray-800 mb-2">
                    Today's Delivery Status
                  </h2>
                  <p className="text-gray-600">
                    {formatDate(new Date())}
                  </p>
                </div>
                
                <button
                  onClick={handleTogglePauseToday}
                  disabled={toggling}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    subscription.isTodayPaused
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                >
                  {toggling ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : subscription.isTodayPaused ? (
                    <>
                      <PlayCircle className="w-5 h-5" />
                      <span>Resume Today's Delivery</span>
                    </>
                  ) : (
                    <>
                      <PauseCircle className="w-5 h-5" />
                      <span>Pause Today's Delivery</span>
                    </>
                  )}
                </button>
              </div>

              {subscription.isTodayPaused && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start space-x-3">
                  <PauseCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 font-medium">Delivery Paused for Today</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      This day will be added to the end of your subscription period.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Subscription Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Milk Type Card */}
              <div className="card-hover p-6 animate-slide-in" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-dairy-400 to-dairy-600 rounded-xl">
                    <Milk className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-1">Milk Type</p>
                <p className="text-2xl font-bold text-gray-800">{getMilkTypeName(subscription.milkType)}</p>
                <p className="text-gray-600 text-sm mt-2">{subscription.quantity}L per day</p>
              </div>

              {/* Duration Card */}
              <div className="card-hover p-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-1">Total Days</p>
                <p className="text-2xl font-bold text-gray-800">{subscription.totalDays} days</p>
                <p className="text-gray-600 text-sm mt-2">
                  {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                </p>
              </div>

              {/* Paused Days Card */}
              <div className="card-hover p-6 animate-slide-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl">
                    <PauseCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-1">Paused Days</p>
                <p className="text-2xl font-bold text-gray-800">{subscription.pausedDates.length}</p>
                <p className="text-gray-600 text-sm mt-2">Extended delivery period</p>
              </div>

              {/* Total Cost Card */}
              <div className="card-hover p-6 animate-slide-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(subscription.pricePerLiter * subscription.quantity * subscription.totalDays)}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  {formatCurrency(subscription.pricePerLiter)} per liter
                </p>
              </div>
            </div>

            {/* Calendar View */}
            <SubscriptionCalendar subscription={subscription} />
          </div>
        )}
      </div>

      {/* Create Subscription Modal */}
      {showCreateModal && (
        <CreateSubscriptionModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleSubscriptionCreated}
        />
      )}
    </div>
  );
};

export default CustomerDashboard;