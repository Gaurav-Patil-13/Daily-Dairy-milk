import { format, addDays, isToday, isPast, isFuture, differenceInDays } from 'date-fns';

// Format date for display
export const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

// Format date with time
export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM dd, yyyy hh:mm a');
};

// Check if date is today
export const checkIsToday = (date) => {
  return isToday(new Date(date));
};

// Check if date is in the past
export const checkIsPast = (date) => {
  return isPast(new Date(date));
};

// Check if date is in the future
export const checkIsFuture = (date) => {
  return isFuture(new Date(date));
};

// Calculate days between dates
export const getDaysDifference = (date1, date2) => {
  return differenceInDays(new Date(date2), new Date(date1));
};

// Calculate total price
export const calculateTotalPrice = (pricePerLiter, quantity, totalDays) => {
  return pricePerLiter * quantity * totalDays;
};

// Get milk type display name
export const getMilkTypeName = (type) => {
  const types = {
    cow: 'Cow Milk',
    buffalo: 'Buffalo Milk',
    mixed: 'Mixed Milk'
  };
  return types[type] || type;
};

// Get subscription status color
export const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};