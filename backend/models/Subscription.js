import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  milkType: {
    type: String,
    enum: ['cow', 'buffalo', 'mixed'],
    required: true
  },
  quantity: {
    type: Number, // liters per day
    required: true,
    default: 1
  },
  pricePerLiter: {
    type: Number,
    required: true
  },
  totalDays: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  // Array of dates when delivery is paused/skipped
  pausedDates: [{
    type: Date
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual field to calculate end date
// End date = startDate + totalDays + number of paused days
subscriptionSchema.virtual('endDate').get(function() {
  const start = new Date(this.startDate);
  const totalDaysToAdd = this.totalDays + this.pausedDates.length - 1;
  const endDate = new Date(start);
  endDate.setDate(start.getDate() + totalDaysToAdd);
  return endDate;
});

// Virtual field to check if today is paused
subscriptionSchema.virtual('isTodayPaused').get(function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.pausedDates.some(pausedDate => {
    const pd = new Date(pausedDate);
    pd.setHours(0, 0, 0, 0);
    return pd.getTime() === today.getTime();
  });
});

// Method to check if a date is within subscription period
subscriptionSchema.methods.isDateInRange = function(date) {
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  const start = new Date(this.startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = this.endDate;
  end.setHours(0, 0, 0, 0);
  
  return checkDate >= start && checkDate <= end;
};

// Method to toggle pause for a specific date
subscriptionSchema.methods.togglePauseDate = function(date) {
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  // Check if date already paused
  const index = this.pausedDates.findIndex(pd => {
    const pausedDate = new Date(pd);
    pausedDate.setHours(0, 0, 0, 0);
    return pausedDate.getTime() === checkDate.getTime();
  });
  
  if (index > -1) {
    // Remove pause (unpause)
    this.pausedDates.splice(index, 1);
    return { action: 'unpaused', date: checkDate };
  } else {
    // Add pause
    this.pausedDates.push(checkDate);
    return { action: 'paused', date: checkDate };
  }
};

// Enable virtuals in JSON
subscriptionSchema.set('toJSON', { virtuals: true });
subscriptionSchema.set('toObject', { virtuals: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;