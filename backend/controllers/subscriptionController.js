import Subscription from '../models/Subscription.js';

// @desc    Create new subscription
// @route   POST /api/subscriptions
// @access  Private (Customer)
export const createSubscription = async (req, res) => {
  try {
    const { milkType, quantity, pricePerLiter, totalDays, startDate } = req.body;

    // Check if customer already has an active subscription
    const existingSubscription = await Subscription.findOne({
      customer: req.user._id,
      status: 'active'
    });

    if (existingSubscription) {
      return res.status(400).json({ 
        message: 'You already have an active subscription. Please cancel or wait for it to complete.' 
      });
    }

    const subscription = await Subscription.create({
      customer: req.user._id,
      milkType,
      quantity,
      pricePerLiter,
      totalDays,
      startDate: startDate || new Date(),
      status: 'active'
    });

    const populatedSubscription = await Subscription.findById(subscription._id)
      .populate('customer', 'name email phone address');

    res.status(201).json(populatedSubscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer's subscriptions
// @route   GET /api/subscriptions/my-subscriptions
// @access  Private (Customer)
export const getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ customer: req.user._id })
      .populate('customer', 'name email phone address')
      .sort('-createdAt');

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active subscription for customer
// @route   GET /api/subscriptions/active
// @access  Private (Customer)
export const getActiveSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      customer: req.user._id,
      status: 'active'
    }).populate('customer', 'name email phone address');

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle pause for today's delivery
// @route   POST /api/subscriptions/:id/toggle-pause
// @access  Private (Customer)
export const togglePauseToday = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      customer: req.user._id,
      status: 'active'
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Get date to pause (default to today, can be passed in body)
    const dateToToggle = req.body.date ? new Date(req.body.date) : new Date();
    dateToToggle.setHours(0, 0, 0, 0);

    // Check if date is within subscription range
    if (!subscription.isDateInRange(dateToToggle)) {
      return res.status(400).json({ message: 'Date is outside subscription period' });
    }

    // Toggle pause
    const result = subscription.togglePauseDate(dateToToggle);
    await subscription.save();

    const updatedSubscription = await Subscription.findById(subscription._id)
      .populate('customer', 'name email phone address');

    res.json({
      message: `Delivery ${result.action} for ${dateToToggle.toDateString()}`,
      action: result.action,
      subscription: updatedSubscription
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel subscription
// @route   PUT /api/subscriptions/:id/cancel
// @access  Private (Customer)
export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      customer: req.user._id
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.status = 'cancelled';
    await subscription.save();

    res.json({ message: 'Subscription cancelled successfully', subscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all subscriptions (Seller only)
// @route   GET /api/subscriptions/all
// @access  Private (Seller)
export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate('customer', 'name email phone address')
      .sort('-createdAt');

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get today's delivery summary (Seller only)
// @route   GET /api/subscriptions/today-summary
// @access  Private (Seller)
export const getTodaySummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all active subscriptions
    const activeSubscriptions = await Subscription.find({ status: 'active' })
      .populate('customer', 'name email phone address');

    // Filter subscriptions that are active today
    const todayDeliveries = activeSubscriptions.filter(sub => {
      return sub.isDateInRange(today);
    });

    // Separate into delivering and paused
    const delivering = [];
    const paused = [];

    todayDeliveries.forEach(sub => {
      if (sub.isTodayPaused) {
        paused.push(sub);
      } else {
        delivering.push(sub);
      }
    });

    // Calculate totals by milk type
    const milkTypeTotals = {
      cow: 0,
      buffalo: 0,
      mixed: 0
    };

    delivering.forEach(sub => {
      milkTypeTotals[sub.milkType] += sub.quantity;
    });

    res.json({
      date: today,
      totalDeliveries: delivering.length,
      totalPaused: paused.length,
      delivering,
      paused,
      milkTypeTotals
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};