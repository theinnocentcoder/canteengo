import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  Plus,
  TrendingUp,
  Gift,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Star,
  Zap,
  Crown,
  ChevronRight,
} from 'lucide-react';
import { MOCK_USER } from '../lib/mockData';
import {
  fadeInUp,
  staggerContainer,
  slideInRight,
  scaleIn,
} from '../lib/animations';
import { Button } from '../components/ui/button';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

interface RechargeOption {
  id: string;
  amount: number;
  bonus: number;
}

export default function WalletPage() {
  const [selectedRecharge, setSelectedRecharge] = useState<string | null>(null);
  const [showRechargeModal, setShowRechargeModal] = useState(false);

  // Recharge options
  const rechargeOptions: RechargeOption[] = [
    { id: '1', amount: 100, bonus: 0 },
    { id: '2', amount: 250, bonus: 25 },
    { id: '3', amount: 500, bonus: 75 },
    { id: '4', amount: 1000, bonus: 200 },
  ];

  // Mock transactions
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'debit',
      description: 'Order CG-X8M2K9P5',
      amount: 510,
      date: 'Today, 12:45 PM',
      status: 'completed',
    },
    {
      id: '2',
      type: 'credit',
      description: 'Loyalty Bonus',
      amount: 51,
      date: 'Today, 10:00 AM',
      status: 'completed',
    },
    {
      id: '3',
      type: 'debit',
      description: 'Order CG-A4B7N2L9',
      amount: 320,
      date: 'Yesterday, 11:30 AM',
      status: 'completed',
    },
    {
      id: '4',
      type: 'credit',
      description: 'Recharge Bonus',
      amount: 50,
      date: 'Yesterday, 9:15 AM',
      status: 'completed',
    },
    {
      id: '5',
      type: 'debit',
      description: 'Order CG-K5Q3V8J2',
      amount: 280,
      date: '2 days ago',
      status: 'completed',
    },
  ];

  // Loyalty rewards
  const loyaltyTiers = [
    {
      name: 'Bronze',
      points: 0,
      benefits: ['1% cashback', 'Birthday bonus', 'Early access to deals'],
      color: 'from-orange-400 to-red-500',
    },
    {
      name: 'Silver',
      points: 1000,
      benefits: ['2% cashback', 'Priority support', 'Free delivery'],
      color: 'from-gray-300 to-gray-400',
      current: true,
    },
    {
      name: 'Gold',
      points: 5000,
      benefits: ['5% cashback', '24/7 priority support', 'Free delivery always'],
      color: 'from-yellow-300 to-yellow-500',
    },
  ];

  const currentTier = loyaltyTiers.find((t) => t.current);
  const nextTier = loyaltyTiers[loyaltyTiers.findIndex((t) => t.current) + 1];
  const pointsToNextTier = nextTier ? nextTier.points - MOCK_USER.loyaltyPoints : 0;
  const progressPercent = nextTier
    ? ((MOCK_USER.loyaltyPoints - currentTier!.points) /
        (nextTier.points - currentTier!.points)) *
      100
    : 100;

  const handleRecharge = (amount: number) => {
    alert(`Redirecting to payment for ₹${amount}`);
    setShowRechargeModal(false);
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
            <Wallet className="w-8 h-8 text-orange-500" />
            My Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your balance and rewards
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:col-span-2 space-y-8"
          >
            {/* Wallet Balance Card */}
            <motion.div
              variants={slideInRight}
              className="relative rounded-3xl overflow-hidden h-56 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 shadow-xl"
            >
              {/* Animated Background Elements */}
              <motion.div
                className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"
                animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              />

              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 font-medium text-sm">
                      Current Balance
                    </p>
                    <motion.h2
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-5xl md:text-6xl font-bold text-white mt-2"
                    >
                      ₹{MOCK_USER.walletBalance}
                    </motion.h2>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, linear: true }}
                  >
                    <Wallet className="w-20 h-20 text-white/30" />
                  </motion.div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-xs font-medium">
                      Quick Actions
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowRechargeModal(true)}
                    className="px-4 py-2 rounded-full bg-white text-orange-600 font-bold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Money
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Recharge Options */}
            {showRechargeModal && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card dark:shadow-none dark:border dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Add Money
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowRechargeModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    ✕
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {rechargeOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRecharge(option.id)}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        selectedRecharge === option.id
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
                      }`}
                    >
                      <p className="font-bold text-lg text-gray-900 dark:text-white">
                        ₹{option.amount}
                      </p>
                      {option.bonus > 0 && (
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                          +₹{option.bonus} bonus
                        </p>
                      )}
                    </motion.button>
                  ))}
                </div>

                <Button
                  onClick={() => {
                    const selected = rechargeOptions.find(
                      (o) => o.id === selectedRecharge
                    );
                    if (selected) handleRecharge(selected.amount);
                  }}
                  disabled={!selectedRecharge}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold"
                >
                  Proceed to Payment
                </Button>
              </motion.div>
            )}

            {/* Loyalty Tier Progress */}
            <motion.div
              variants={fadeInUp}
              className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card dark:shadow-none dark:border dark:border-gray-700 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Crown className="w-6 h-6 text-purple-500" />
                  Loyalty Progress
                </h3>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {MOCK_USER.loyaltyPoints} / {nextTier?.points || '∞'} points
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>{currentTier?.name} Tier</span>
                  <span>{pointsToNextTier} points to next tier</span>
                </div>
              </div>

              {/* Current Tier */}
              <div className={`p-4 rounded-xl bg-gradient-to-br ${currentTier?.color || ''} text-white`}>
                <p className="font-bold text-lg mb-2">{currentTier?.name} Member</p>
                <ul className="text-sm space-y-1">
                  {currentTier?.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Tier */}
              {nextTier && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
                >
                  <p className="font-bold text-gray-900 dark:text-white mb-2">
                    Unlock {nextTier.name} Tier
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Earn {pointsToNextTier} more points to unlock premium benefits
                  </p>
                  <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                    {nextTier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-purple-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>

            {/* Transactions */}
            <motion.div
              variants={fadeInUp}
              className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card dark:shadow-none dark:border dark:border-gray-700 space-y-4"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Transactions
              </h3>

              <div className="space-y-3">
                {transactions.map((txn, idx) => (
                  <motion.div
                    key={txn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-lg ${
                          txn.type === 'credit'
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}
                      >
                        {txn.type === 'credit' ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {txn.description}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {txn.date}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-bold text-lg ${
                        txn.type === 'credit'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ x: 5 }}
                className="w-full py-3 text-center text-orange-600 dark:text-orange-400 font-medium hover:underline flex items-center justify-center gap-2"
              >
                View All Transactions
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Sidebar - Wallet Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* Quick Stats */}
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Total Spent"
              value="₹2,150"
              color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            />
            <StatCard
              icon={<Gift className="w-6 h-6" />}
              title="Total Rewards"
              value="₹320"
              color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
            />
            <StatCard
              icon={<Star className="w-6 h-6" />}
              title="Loyalty Points"
              value={`${MOCK_USER.loyaltyPoints}`}
              color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            />

            {/* Security Notice */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 space-y-2"
            >
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                💡 Pro Tips
              </p>
              <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
                <li>• Earn extra rewards on bulk orders</li>
                <li>• Use wallet for faster checkouts</li>
                <li>• Loyalty tiers reset yearly</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className={`rounded-2xl p-6 shadow-card dark:shadow-none dark:border dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3`}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </motion.div>
  );
}
