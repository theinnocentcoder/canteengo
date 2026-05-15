import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  ChefHat,
  Check,
  Package,
  QrCode,
  Star,
  ChevronRight,
  MapPin,
  Phone,
  MoreVertical,
} from 'lucide-react';
import { MOCK_USER } from '../lib/mockData';
import {
  fadeInUp,
  staggerContainer,
  slideInRight,
} from '../lib/animations';
import { Button } from '../components/ui/button';

interface Order {
  id: string;
  status: 'placed' | 'preparing' | 'ready' | 'picked';
  orderToken: string;
  items: { name: string; qty: number }[];
  total: number;
  pickupTime: string;
  prepTime: string;
  qrCode: string;
  date: string;
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      status: 'preparing',
      orderToken: 'CG-X8M2K9P5',
      items: [
        { name: 'Butter Chicken', qty: 2 },
        { name: 'Paneer Tikka', qty: 1 },
      ],
      total: 510,
      pickupTime: '12:45 PM',
      prepTime: '15 min',
      qrCode: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23fff" width="200" height="200"/%3E%3Crect fill="%23000" x="10" y="10" width="30" height="30"/%3E%3Crect fill="%23000" x="60" y="10" width="30" height="30"/%3E%3Crect fill="%23000" x="10" y="60" width="30" height="30"/%3E%3C/svg%3E',
      date: 'Today',
    },
    {
      id: '2',
      status: 'ready',
      orderToken: 'CG-A4B7N2L9',
      items: [
        { name: 'Chole Bhature', qty: 1 },
        { name: 'Mango Lassi', qty: 2 },
      ],
      total: 320,
      pickupTime: '11:30 AM',
      prepTime: 'Ready',
      qrCode: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23fff" width="200" height="200"/%3E%3Crect fill="%23000" x="10" y="10" width="30" height="30"/%3E%3Crect fill="%23000" x="60" y="10" width="30" height="30"/%3E%3Crect fill="%23000" x="10" y="60" width="30" height="30"/%3E%3C/svg%3E',
      date: 'Today',
    },
  ]);

  const [historicalOrders] = useState<Order[]>([
    {
      id: '3',
      status: 'picked',
      orderToken: 'CG-K5Q3V8J2',
      items: [{ name: 'Biryani', qty: 1 }],
      total: 280,
      pickupTime: '1:30 PM',
      prepTime: 'Completed',
      qrCode: '',
      date: 'Yesterday',
    },
    {
      id: '4',
      status: 'picked',
      orderToken: 'CG-R6T1W9E3',
      items: [{ name: 'Samosa', qty: 3 }, { name: 'Chai', qty: 1 }],
      total: 160,
      pickupTime: '3:15 PM',
      prepTime: 'Completed',
      qrCode: '',
      date: 'Yesterday',
    },
  ]);

  const activeOrders = orders.filter((o) => o.status !== 'picked');
  const displayOrders = activeTab === 'active' ? activeOrders : historicalOrders;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return <Clock className="w-5 h-5" />;
      case 'preparing':
        return <ChefHat className="w-5 h-5" />;
      case 'ready':
        return <Check className="w-5 h-5" />;
      case 'picked':
        return <Package className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'ready':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'picked':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400';
      default:
        return '';
    }
  };

  const getProgressSteps = () => {
    return [
      { id: 'placed', label: 'Placed', icon: Clock },
      { id: 'preparing', label: 'Preparing', icon: ChefHat },
      { id: 'ready', label: 'Ready', icon: Check },
      { id: 'picked', label: 'Picked', icon: Package },
    ];
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Your Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your orders and view history
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 mb-8"
        >
          {['active', 'history'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab as 'active' | 'history')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab === 'active' ? `Active Orders (${activeOrders.length})` : `Order History (${historicalOrders.length})`}
            </motion.button>
          ))}
        </motion.div>

        {displayOrders.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {activeTab === 'active' ? 'No Active Orders' : 'No Order History'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {activeTab === 'active'
                ? 'You don\'t have any active orders'
                : 'You haven\'t ordered anything yet'}
            </p>
            <Button
              onClick={() => (window.location.href = '/student')}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Browse Menu
            </Button>
          </motion.div>
        ) : (
          // Orders List
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-4"
          >
            {displayOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                statusIcon={getStatusIcon(order.status)}
                statusColor={getStatusColor(order.status)}
                progressSteps={getProgressSteps()}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Order Card Component
function OrderCard({
  order,
  statusIcon,
  statusColor,
  progressSteps,
}: {
  order: Order;
  statusIcon: React.ReactNode;
  statusColor: string;
  progressSteps: any[];
}) {
  const [expanded, setExpanded] = useState(order.status === 'preparing' || order.status === 'ready');

  const currentStepIndex = progressSteps.findIndex((s) => s.id === order.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      variants={fadeInUp}
      className="rounded-2xl bg-white dark:bg-gray-800 shadow-card dark:shadow-none dark:border dark:border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <motion.div
        onClick={() => setExpanded(!expanded)}
        className="p-4 md:p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${statusColor}`}>
              {statusIcon}
            </div>
            <div>
              <p className="font-bold text-lg text-gray-900 dark:text-white">
                Order {order.orderToken}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.date} • {order.pickupTime}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-xl text-orange-600 dark:text-orange-400">
              ₹{order.total}
            </p>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="w-6 h-6 text-gray-400 ml-auto" />
            </motion.div>
          </div>
        </div>

        {/* Quick Status */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Est. {order.prepTime}
          </span>
        </div>
      </motion.div>

      {/* Expanded Content */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: expanded ? 'auto' : 0,
          opacity: expanded ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* Progress Bar */}
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Order Progress
            </p>
            <div className="flex items-center gap-2">
              {progressSteps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <motion.div
                    key={step.id}
                    className="flex items-center flex-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-green-300 dark:ring-green-900' : ''}`}
                      animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    {idx < progressSteps.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 ${
                          idx < currentStepIndex
                            ? 'bg-green-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Items
            </p>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.name}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    x{item.qty}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code & Actions */}
          {order.status !== 'picked' && (
            <div className="space-y-4">
              {/* QR Code */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 flex items-center justify-center">
                  <div className="w-full h-full bg-white dark:bg-gray-800 rounded flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Show this QR at pickup
                </p>
              </div>

              {/* Contact & Location */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-medium">Call</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Location</span>
                </motion.button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={() => (window.location.href = '/student')}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              Reorder
            </Button>
            <Button
              onClick={() => (window.location.href = `/rate/${order.id}`)}
              variant="outline"
              className="flex-1 border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              <Star className="w-4 h-4 mr-2" />
              Rate
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
