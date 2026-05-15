import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingCart, Sparkles, ChevronRight, Plus, Star, Flame } from 'lucide-react';
import { MOCK_ITEMS, MOCK_USER, CATEGORIES } from '../lib/mockData';
import {
  fadeInUp,
  slideInRight,
  staggerContainer,
  scaleIn,
  shimmer,
} from '../lib/animations';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function StudentDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingMenuItems, setIsLoadingMenuItems] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Simulate skeleton loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingMenuItems(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter items based on category and search
  const filteredItems = MOCK_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getLoyaltyColor = (tier: string) => {
    switch (tier) {
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'silver':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'bronze':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const SKeletonCard = () => (
    <motion.div
      className="rounded-2xl bg-gray-200 dark:bg-gray-700 h-64 w-full overflow-hidden"
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );

  const trendingItems = MOCK_ITEMS.filter((item) => item.isTrending).slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-20 md:pt-24 pb-24 md:pb-6">
      {/* Scroll container for mobile navbar accommodation */}
      <div className="w-full px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <motion.div variants={fadeInUp}>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Good morning, {MOCK_USER.name.split(' ')[0]} 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Ready to grab some delicious food?
              </p>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-3 md:gap-4"
            >
              {/* Wallet Balance */}
              <div className="px-4 py-3 rounded-full bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-700/50">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Wallet
                </p>
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  ₹{MOCK_USER.walletBalance.toFixed(2)}
                </p>
              </div>

              {/* Loyalty Tier */}
              <div
                className={`px-4 py-3 rounded-full border ${getLoyaltyColor(
                  MOCK_USER.loyaltyTier
                )}`}
              >
                <p className="text-sm font-medium opacity-75">Tier</p>
                <p className="text-lg font-bold capitalize">
                  {MOCK_USER.loyaltyTier}
                </p>
              </div>

              {/* Queue Wait Time */}
              <div className="px-4 py-3 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700/50">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Queue Wait
                </p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ~8 min
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Search & Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-base rounded-full border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            {!isMobile && (
              <button className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory hide-scrollbar"
          >
            {CATEGORIES.map((category) => (
              <motion.button
                key={category}
                variants={scaleIn}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap snap-center transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Today's Specials Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🎉 Today's Specials
            </h2>
            <button className="text-orange-600 dark:text-orange-400 hover:underline text-sm font-medium flex items-center gap-1">
              See all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Specials Carousel */}
          <motion.div
            className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory hide-scrollbar"
            drag="x"
            dragConstraints={{ left: -500, right: 0 }}
          >
            {MOCK_ITEMS.slice(0, 6).map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex-shrink-0 w-48 snap-center"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
                  {/* Image Container */}
                  <div className="relative h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      Limited!
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 bg-white dark:bg-gray-800">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {item.category}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg text-orange-600 dark:text-orange-400">
                        ₹{item.price}
                      </span>
                      <button className="p-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Trending Now */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Flame className="w-6 h-6 text-red-500" />
              Trending Now
            </h2>
          </div>

          {trendingItems.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {trendingItems.map((item) => (
                <FoodCard key={item.id} item={item} variants={fadeInUp} />
              ))}
            </motion.div>
          ) : (
            <EmptyState message="No trending items available" />
          )}
        </motion.div>

        {/* AI Meal Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 p-8 shadow-xl">
            {/* Animated background elements */}
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"
              animate={{ y: [0, 20, 0], x: [0, 20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Suggested For You</h2>
              </div>
              <p className="text-white/80 mb-6 text-sm">
                AI-picked meals based on your preferences
              </p>

              {/* Suggestion Items */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {MOCK_ITEMS.slice(0, 3).map((item) => (
                  <motion.div
                    key={item.id}
                    variants={fadeInUp}
                    whileHover={{ y: -4 }}
                    className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 cursor-pointer group"
                  >
                    <div className="h-24 bg-white/10 rounded-xl mb-3 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <h3 className="font-bold text-white truncate">{item.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-white/80 text-sm">₹{item.price}</span>
                      <div className="flex items-center gap-1 text-yellow-300 text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        {item.rating}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* All Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              All Menu Items
            </h2>
            {filteredItems.length > 0 && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredItems.length} items
              </span>
            )}
          </div>

          {isLoadingMenuItems ? (
            // Skeleton Loading Grid
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[...Array(8)].map((_, idx) => (
                <motion.div key={idx} variants={fadeInUp}>
                  <SKeletonCard />
                </motion.div>
              ))}
            </motion.div>
          ) : filteredItems.length > 0 ? (
            // Food Items Grid
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {filteredItems.map((item) => (
                <FoodCard key={item.id} item={item} variants={fadeInUp} />
              ))}
            </motion.div>
          ) : (
            // Empty State
            <EmptyState
              message={`No items found in ${selectedCategory}`}
              subtext="Try a different category or search term"
              onClear={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Food Card Component
function FoodCard({ item, variants }: any) {
  const [quantity, setQuantity] = useState(0);

  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -4 }}
      className="group rounded-2xl overflow-hidden shadow-card dark:shadow-none dark:border dark:border-gray-700 hover:shadow-glow transition-all duration-300 bg-white dark:bg-gray-800 cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2 right-2 flex gap-1">
          {item.isVeg && (
            <div className="w-5 h-5 rounded border-2 border-green-500 bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
          )}
          {item.isTrending && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
              🔥
            </span>
          )}
        </div>

        {/* Category Tag */}
        <div className="absolute bottom-2 left-2">
          <span className="text-xs font-semibold bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white px-2 py-1 rounded-full">
            {item.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <h3 className="font-bold text-gray-900 dark:text-white truncate">
          {item.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 text-xs">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(item.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-gray-600 dark:text-gray-400">
            ({item.reviews})
          </span>
        </div>

        {/* Price & Add Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="font-bold text-lg text-orange-600 dark:text-orange-400">
            ₹{item.price}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setQuantity(quantity + 1)}
            className="p-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-colors"
            aria-label="Add to cart"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Empty State Component
function EmptyState({
  message,
  subtext,
  onClear,
}: {
  message: string;
  subtext?: string;
  onClear?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <ShoppingCart className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {message}
      </h3>
      {subtext && (
        <p className="text-gray-600 dark:text-gray-400 mb-6">{subtext}</p>
      )}
      {onClear && (
        <Button
          onClick={onClear}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Clear Filter
        </Button>
      )}
    </motion.div>
  );
}
