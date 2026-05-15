import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  MapPin,
  Wallet,
  CreditCard,
  Smartphone,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  Lock,
  Zap,
} from 'lucide-react';
import { MOCK_USER } from '../lib/mockData';
import {
  fadeInUp,
  staggerContainer,
  slideInRight,
  scaleIn,
} from '../lib/animations';
import { Button } from '../components/ui/button';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  count: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

export default function CheckoutPage() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>('slot-1');
  const [selectedPayment, setSelectedPayment] = useState<string>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Mock time slots
  const timeSlots: TimeSlot[] = [
    { id: 'slot-1', time: '12:30 PM - 12:45 PM', available: true, count: 3 },
    { id: 'slot-2', time: '1:00 PM - 1:15 PM', available: true, count: 8 },
    { id: 'slot-3', time: '1:30 PM - 1:45 PM', available: true, count: 5 },
    { id: 'slot-4', time: '2:00 PM - 2:15 PM', available: true, count: 12 },
    { id: 'slot-5', time: '2:30 PM - 2:45 PM', available: false, count: 15 },
  ];

  // Payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'wallet',
      name: 'CanteenGo Wallet',
      icon: <Wallet className="w-6 h-6" />,
      description: `Balance: ₹${MOCK_USER.walletBalance}`,
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, Mastercard, RuPay',
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Google Pay, PhonePe, Paytm',
    },
  ];

  // Order summary (mock)
  const orderSummary = {
    subtotal: 510,
    discount: 51,
    tax: 25,
    deliveryFee: 0,
  };
  const total = orderSummary.subtotal + orderSummary.tax + orderSummary.deliveryFee - orderSummary.discount;

  // Generate order token
  const generateToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = 'CG-';
    for (let i = 0; i < 8; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
  };

  const handlePlaceOrder = async () => {
    if (!selectedSlot) {
      alert('Please select a pickup time slot');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setOrderPlaced(true);
    setIsProcessing(false);

    // Redirect after success
    setTimeout(() => {
      window.location.href = '/orders';
    }, 3000);
  };

  if (orderPlaced) {
    return <OrderSuccessScreen token={generateToken()} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-20 md:pt-24 pb-24 md:pb-6">
      <div className="w-full px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center justify-center gap-4"
        >
          {['Cart', 'Checkout', 'Payment', 'Confirm'].map((step, idx) => (
            <div key={step} className="flex items-center gap-4">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  idx <= 1
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {idx === 1 ? '✓' : idx + 1}
              </motion.div>
              <span
                className={`font-medium hidden sm:inline ${
                  idx <= 1
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {step}
              </span>
              {idx < 3 && (
                <ChevronRight className={`w-5 h-5 mx-2 hidden sm:inline ${
                  idx < 1
                    ? 'text-gray-400 dark:text-gray-600'
                    : 'text-gray-300 dark:text-gray-700'
                }`} />
              )}
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:col-span-2 space-y-8"
          >
            {/* Time Slot Selection */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Clock className="w-6 h-6 text-orange-500" />
                Select Pickup Time
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose your preferred pickup time slot
              </p>

              {/* Time Slots Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {timeSlots.map((slot) => (
                  <motion.button
                    key={slot.id}
                    whileHover={{ scale: slot.available ? 1.02 : 1 }}
                    whileTap={{ scale: slot.available ? 0.98 : 1 }}
                    onClick={() => slot.available && setSelectedSlot(slot.id)}
                    disabled={!slot.available}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      selectedSlot === slot.id
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : slot.available
                        ? 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
                        : 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {slot.time}
                        </p>
                        <p className={`text-sm ${
                          slot.available
                            ? 'text-gray-600 dark:text-gray-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {slot.available
                            ? `${slot.count} slots available`
                            : 'Slot full'}
                        </p>
                      </div>
                      {slot.available && selectedSlot === slot.id && (
                        <CheckCircle2 className="w-6 h-6 text-orange-500" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Capacity Warning */}
              {selectedSlot === 'slot-1' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 flex gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 dark:text-amber-300">
                      Limited Slots
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-400">
                      Only 3 slots remaining for this time. Book now!
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Payment Method Selection */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-orange-500" />
                Payment Method
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose how you want to pay
              </p>

              {/* Payment Options */}
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                      selectedPayment === method.id
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
                    }`}
                  >
                    <div className={`p-3 rounded-lg ${
                      selectedPayment === method.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {method.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {method.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {method.description}
                      </p>
                    </div>
                    {selectedPayment === method.id && (
                      <CheckCircle2 className="w-6 h-6 text-orange-500" />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Security Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 pt-4 text-sm text-gray-600 dark:text-gray-400"
              >
                <Lock className="w-4 h-4" />
                <span>Payments are secured with 256-bit encryption</span>
              </motion.div>
            </motion.div>

            {/* Delivery Instructions */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <MapPin className="w-6 h-6 text-orange-500" />
                Pickup Location
              </h2>
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50">
                <p className="font-semibold text-gray-900 dark:text-white">
                  Central Cafeteria
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Building A, Ground Floor • Near Student Center
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Order Summary Card - Sticky */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 rounded-3xl bg-white dark:bg-gray-800 shadow-card dark:shadow-none dark:border dark:border-gray-700 p-6 space-y-6">
              {/* Summary Title */}
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Order Summary
              </h3>

              {/* Items List */}
              <div className="space-y-2 pb-4 border-b border-gray-200 dark:border-gray-700">
                {[
                  { name: 'Butter Chicken', qty: 2, price: 250 },
                  { name: 'Paneer Tikka', qty: 1, price: 180 },
                  { name: 'Mango Lassi', qty: 2, price: 80 },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.name} x{item.qty}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ₹{item.price * item.qty}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2">
                <SummaryRow
                  label="Subtotal"
                  value={`₹${orderSummary.subtotal}`}
                  className="text-gray-600 dark:text-gray-400"
                />
                {orderSummary.discount > 0 && (
                  <SummaryRow
                    label="Loyalty Discount (10%)"
                    value={`-₹${orderSummary.discount}`}
                    className="text-green-600 dark:text-green-400 font-medium"
                  />
                )}
                <SummaryRow
                  label="Tax (5%)"
                  value={`₹${orderSummary.tax}`}
                  className="text-gray-600 dark:text-gray-400"
                />
                {orderSummary.deliveryFee === 0 ? (
                  <SummaryRow
                    label="Delivery"
                    value="FREE"
                    className="text-green-600 dark:text-green-400 font-medium"
                  />
                ) : (
                  <SummaryRow
                    label="Delivery"
                    value={`₹${orderSummary.deliveryFee}`}
                    className="text-gray-600 dark:text-gray-400"
                  />
                )}
              </div>

              {/* Total */}
              <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    ₹{total}
                  </span>
                </div>
              </div>

              {/* Loyalty Points */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="px-4 py-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50"
              >
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Loyalty Points Earned
                </p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  +{Math.floor(total * 0.5)} points
                </p>
              </motion.div>

              {/* Place Order Button */}
              <motion.button
                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                onClick={handlePlaceOrder}
                disabled={!selectedSlot || isProcessing}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  isProcessing || !selectedSlot
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-glow'
                }`}
              >
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Zap className="w-5 h-5" />
                    </motion.div>
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              {/* Terms Notice */}
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                By placing order, you agree to our Terms & Conditions
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Order Success Screen
function OrderSuccessScreen({ token }: { token: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="text-center max-w-md"
      >
        {/* Success Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center"
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Order Placed!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your delicious meal is being prepared
        </p>

        {/* Token */}
        <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Your Order Token
          </p>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 font-mono">
            {token}
          </p>
        </div>

        {/* Redirect Message */}
        <motion.p
          animate={{ opacity: [0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          Redirecting to orders page...
        </motion.p>
      </motion.div>
    </div>
  );
}

// Summary Row Component
function SummaryRow({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
