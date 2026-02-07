import { useState } from 'react';
import { subscriptionAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { X, Milk, Calendar, Package } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const CreateSubscriptionModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    milkType: 'cow',
    quantity: 1,
    totalDays: 30,
    customDays: '',
    durationType: '30'
  });
  const [loading, setLoading] = useState(false);

  const milkPrices = {
    cow: 60,
    buffalo: 70,
    mixed: 65
  };

  const milkTypes = [
    { value: 'cow', label: 'Cow Milk', description: 'Light & easily digestible', price: 60 },
    { value: 'buffalo', label: 'Buffalo Milk', description: 'Rich & creamy', price: 70 },
    { value: 'mixed', label: 'Mixed Milk', description: 'Best of both worlds', price: 65 }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'durationType') {
      setFormData({
        ...formData,
        durationType: value,
        totalDays: value === 'custom' ? formData.customDays : parseInt(value)
      });
    } else if (name === 'customDays') {
      setFormData({
        ...formData,
        customDays: value,
        totalDays: parseInt(value) || 0
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const calculateTotal = () => {
    const price = milkPrices[formData.milkType];
    return price * formData.quantity * formData.totalDays;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.totalDays < 1) {
      toast.error('Please select a valid duration');
      return;
    }

    setLoading(true);

    try {
      const subscriptionData = {
        milkType: formData.milkType,
        quantity: parseInt(formData.quantity),
        pricePerLiter: milkPrices[formData.milkType],
        totalDays: parseInt(formData.totalDays),
        startDate: new Date()
      };

      const { data } = await subscriptionAPI.create(subscriptionData);
      onSuccess(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-dairy-400 to-dairy-600 rounded-xl">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-800">
                Create Subscription
              </h2>
              <p className="text-sm text-gray-600">Choose your milk delivery plan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Milk Type Selection */}
          <div>
            <label className="label flex items-center space-x-2 mb-4">
              <Milk className="w-4 h-4" />
              <span>Select Milk Type</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {milkTypes.map((type) => (
                <label
                  key={type.value}
                  className={`card-hover p-4 cursor-pointer transition-all ${
                    formData.milkType === type.value
                      ? 'ring-2 ring-dairy-500 bg-dairy-50'
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="milkType"
                    value={type.value}
                    checked={formData.milkType === type.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="font-semibold text-gray-800 mb-1">{type.label}</div>
                    <div className="text-xs text-gray-600 mb-2">{type.description}</div>
                    <div className="text-lg font-bold text-dairy-600">
                      {formatCurrency(type.price)}/L
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="label">Daily Quantity (Liters)</label>
            <select
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="input-field"
            >
              <option value="0.5">0.5L</option>
              <option value="1">1L</option>
              <option value="1.5">1.5L</option>
              <option value="2">2L</option>
              <option value="3">3L</option>
              <option value="5">5L</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="label flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4" />
              <span>Subscription Duration</span>
            </label>
            
            <div className="grid grid-cols-3 gap-3 mb-3">
              <label
                className={`card-hover p-4 cursor-pointer text-center transition-all ${
                  formData.durationType === '15'
                    ? 'ring-2 ring-dairy-500 bg-dairy-50'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="durationType"
                  value="15"
                  checked={formData.durationType === '15'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="font-bold text-gray-800">15 Days</div>
              </label>

              <label
                className={`card-hover p-4 cursor-pointer text-center transition-all ${
                  formData.durationType === '30'
                    ? 'ring-2 ring-dairy-500 bg-dairy-50'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="durationType"
                  value="30"
                  checked={formData.durationType === '30'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="font-bold text-gray-800">30 Days</div>
              </label>

              <label
                className={`card-hover p-4 cursor-pointer text-center transition-all ${
                  formData.durationType === 'custom'
                    ? 'ring-2 ring-dairy-500 bg-dairy-50'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="durationType"
                  value="custom"
                  checked={formData.durationType === 'custom'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="font-bold text-gray-800">Custom</div>
              </label>
            </div>

            {formData.durationType === 'custom' && (
              <input
                type="number"
                name="customDays"
                value={formData.customDays}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter number of days"
                min="1"
                max="365"
              />
            )}
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-dairy-50 to-cyan-50 p-6 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-4">Subscription Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Milk Type:</span>
                <span className="font-medium text-gray-800">
                  {milkTypes.find(t => t.value === formData.milkType)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Quantity:</span>
                <span className="font-medium text-gray-800">{formData.quantity}L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium text-gray-800">{formData.totalDays} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price per Liter:</span>
                <span className="font-medium text-gray-800">
                  {formatCurrency(milkPrices[formData.milkType])}
                </span>
              </div>
              <div className="pt-3 mt-3 border-t border-gray-300 flex justify-between">
                <span className="font-semibold text-gray-800">Total Amount:</span>
                <span className="font-bold text-xl text-dairy-600">
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || formData.totalDays < 1}
              className="flex-1 btn-primary"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Subscription'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubscriptionModal;