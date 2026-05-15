import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  Package,
  Clock,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { MOCK_ITEMS, MOCK_USER } from '../lib/mockData';
import {
  fadeInUp,
  staggerContainer,
  slideInRight,
} from '../lib/animations';
import { Button } from '../components/ui/button';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Butter Chicken',
      price: 250,
      image: MOCK_ITEMS[0].image,
      quantity: 2,
      category: 'Meals',
    },
    {
      id: '2',
      name: 'Paneer Tikka',
      price: 180,
      image: MOCK_ITEMS[1].image,
      quantity: 1,
      category: 'Snacks',
    },
    {
      id: '3',
      name: 'Mango Lassi',
      price: 80,
      image: MOCK_ITEMS[2].image,
      quantity: 2,
      category: 'Beverages',
    },
  ]);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const discount = Math.floor(subtotal * 0.1);
  const total = subtotal + deliveryFee + tax - discount;

  // Update quantity
  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Delete item with animation
  const deleteItem = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      setDeletingId(null);
    }, 300);
  };

  const handleCheckout = () => {
    window.location.href = '/checkout';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-20 md:pt-24 pb-24 md:pb-6">
      <div className="w-full px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-orange-500" />
            Your Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} ready to
            checkout
          </p>
        </motion.div>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Cart is Empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Add some delicious food to get started!
            </p>
            <Button
              onClick={() => (window.location.href = '/student')}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Continue Shopping
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-2 space-y-4"
            >
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onDelete={deleteItem}
                  isDeleting={deletingId === item.id}
                />
              ))}

              {/* Continue Shopping Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => (window.location.href = '/student')}
                className="w-full py-3 rounded-lg border-2 border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 font-medium transition-colors"
              >
                + Add More Items
              </motion.button>
            </motion.div>

            {/* Order Summary Sticky Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 rounded-3xl bg-white dark:bg-gray-800 shadow-card dark:shadow-none dark:border dark:border-gray-700 p-6 space-y-6">
                {/* Loyalty Badge */}
                <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        Loyalty Points
                      </p>
                      <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        +{Math.floor(total * 0.5)}
                      </p>
                    </div>
                    <Tag className="w-6 h-6 text-purple-500" />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    Order Summary
                  </h3>

                  {/* Subtotal */}
                  <SummaryRow
                    label="Subtotal"
                    value={`₹${subtotal}`}
                    className="text-gray-600 dark:text-gray-400"
                  />

                  {/* Discount */}
                  {discount > 0 && (
                    <SummaryRow
                      label="10% Loyalty Discount"
                      value={`-₹${discount}`}
                      className="text-green-600 dark:text-green-400 font-medium"
                    />
                  )}

                  {/* Tax */}
                  <SummaryRow
                    label="Tax (5%)"
                    value={`₹${tax}`}
                    className="text-gray-600 dark:text-gray-400"
                  />

                  {/* Delivery Fee */}
                  <div className="py-2 border-b border-gray-200 dark:border-gray-700">
                    <SummaryRow
                      label={
                        deliveryFee === 0 ? (
                          <span className="flex items-center gap-2">
                            Delivery
                            <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                              FREE
                            </span>
                          </span>
                        ) : (
                          'Delivery'
                        )
                      }
                      value={`₹${deliveryFee}`}
                      className="text-gray-600 dark:text-gray-400 text-sm"
                    />
                  </div>

                  {/* Total */}
                  <div className="pt-2">
                    <SummaryRow
                      label="Total Amount"
                      value={`₹${total}`}
                      className="text-xl font-bold text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Estimated Time */}
                <div className="px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                    ~20-25 min delivery
                  </span>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold transition-all shadow-lg hover:shadow-glow flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                {/* Payment Methods Info */}
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  ✓ Credit/Debit Card • Wallet • UPI
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

// Cart Item Card with Swipe Support
function CartItemCard({
  item,
  onUpdateQuantity,
  onDelete,
  isDeleting,
}: {
  item: CartItem;
  onUpdateQuantity: (id: string, delta: number) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = (offset: number) => {
    setIsDragging(false);
    if (offset < -100) {
      onDelete(item.id);
    } else {
      setDragX(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isDeleting ? 0 : 1,
        y: isDeleting ? -20 : 0,
        height: isDeleting ? 0 : 'auto',
      }}
      transition={{ duration: 0.3 }}
      drag="x"
      dragConstraints={{ left: -200, right: 0 }}
      dragElastic={0.2}
      onDragStart={handleDragStart}
      onDragEnd={(_, info) => handleDragEnd(info.offset.x)}
      className="relative rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-card dark:shadow-none dark:border dark:border-gray-700 hover:shadow-lg transition-shadow"
    >
      {/* Delete Background */}
      <div className="absolute inset-0 bg-red-500 flex items-center justify-end pr-6 z-0">
        <Trash2 className="w-6 h-6 text-white" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 bg-white dark:bg-gray-800 flex gap-4">
        {/* Product Image */}
        <div className="relative h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              {item.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {item.category}
            </p>
          </div>

          {/* Price & Quantity */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-orange-600 dark:text-orange-400">
              ₹{item.price * item.quantity}
            </span>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onUpdateQuantity(item.id, -1)}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <span className="w-6 text-center font-semibold text-gray-900 dark:text-white">
                {item.quantity}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onUpdateQuantity(item.id, 1)}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Delete Button (Desktop) */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(item.id)}
          className="hidden md:flex absolute top-4 right-4 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5 text-red-500" />
        </motion.button>
      </div>

      {/* Swipe Hint (Mobile) */}
      {!isDragging && (
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
        >
          ← Swipe
        </motion.div>
      )}
    </motion.div>
  );
}

// Summary Row Component
function SummaryRow({
  label,
  value,
  className = '',
}: {
  label: string | React.ReactNode;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between py-2 ${className}`}>
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
