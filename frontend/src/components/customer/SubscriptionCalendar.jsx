import { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format, addDays, isSameDay, isPast, isFuture } from 'date-fns';

const SubscriptionCalendar = ({ subscription }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (!subscription) return null;

  const startDate = new Date(subscription.startDate);
  const endDate = new Date(subscription.endDate);

  // Generate all days in subscription period
  const generateDays = () => {
    const days = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    return days;
  };

  const allDays = generateDays();

  // Check if a date is paused
  const isPaused = (date) => {
    return subscription.pausedDates.some(pausedDate => {
      const pd = new Date(pausedDate);
      return isSameDay(pd, date);
    });
  };

  // Get status for a day
  const getDayStatus = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    if (isPaused(date)) {
      return { status: 'paused', label: 'Paused', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    }
    
    if (checkDate < today) {
      return { status: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800 border-green-300' };
    }
    
    if (isSameDay(checkDate, today)) {
      return { status: 'today', label: 'Today', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    }
    
    return { status: 'upcoming', label: 'Scheduled', color: 'bg-gray-100 text-gray-800 border-gray-300' };
  };

  return (
    <div className="card p-6 animate-slide-in">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-800">Delivery Schedule</h2>
          <p className="text-gray-600 text-sm">View and manage your delivery calendar</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
          <span className="text-sm text-gray-700">Delivered</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
          <span className="text-sm text-gray-700">Today</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
          <span className="text-sm text-gray-700">Paused</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
          <span className="text-sm text-gray-700">Scheduled</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {allDays.map((day, index) => {
          const dayStatus = getDayStatus(day);
          
          return (
            <div
              key={index}
              className={`p-3 rounded-xl border-2 transition-all duration-200 ${dayStatus.color} hover:scale-105`}
            >
              <div className="text-center">
                <div className="text-xs font-medium mb-1">
                  {format(day, 'EEE')}
                </div>
                <div className="text-lg font-bold mb-1">
                  {format(day, 'd')}
                </div>
                <div className="text-xs">
                  {format(day, 'MMM')}
                </div>
                <div className="mt-2 flex justify-center">
                  {dayStatus.status === 'delivered' && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  {dayStatus.status === 'paused' && (
                    <XCircle className="w-4 h-4 text-yellow-600" />
                  )}
                  {dayStatus.status === 'today' && (
                    <Clock className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{allDays.length}</div>
          <div className="text-sm text-gray-600">Total Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {allDays.filter(day => {
              const status = getDayStatus(day);
              return status.status === 'delivered';
            }).length}
          </div>
          <div className="text-sm text-gray-600">Delivered</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {subscription.pausedDates.length}
          </div>
          <div className="text-sm text-gray-600">Paused</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {allDays.filter(day => {
              const status = getDayStatus(day);
              return status.status === 'upcoming';
            }).length}
          </div>
          <div className="text-sm text-gray-600">Upcoming</div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCalendar;