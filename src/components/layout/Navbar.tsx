import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Moon, Sun, ShoppingCart, User, LogOut, Wallet, Settings, Bell } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Navbar: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
  const { isDark, toggleDarkMode } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3); // Mock cart count
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/student', icon: '🏠' },
    { label: 'Search', path: '#search', icon: '🔍' },
    { label: 'Orders', path: '/orders', icon: '📦' },
    { label: 'Wallet', path: '#wallet', icon: '💰' },
    { label: 'Profile', path: '#profile', icon: '👤' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Desktop Navbar
  if (!isMobile) {
    return (
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass' : 'bg-transparent'
        } ${isDark ? 'glass-dark' : 'glass'}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              className="text-2xl font-bold text-gradient"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🍽️ CanteenGo
            </motion.div>
          </Link>

          {/* Search Bar */}
          <motion.div
            className="hidden md:flex flex-1 max-w-xs mx-8"
            initial={{ opacity: 0.5 }}
            whileHover={{ opacity: 1 }}
          >
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search food items..."
                className="w-full pl-10 rounded-full bg-white/90 dark:bg-gray-800/90 border-0 focus-ring"
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setIsSearchOpen(false)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </motion.div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Notifications */}
            <motion.button
              className="p-2 hover:bg-white/20 rounded-full transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <motion.span
                className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            {/* Cart Icon */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link to="/cart" className="p-2 hover:bg-white/20 rounded-full transition-colors inline-block">
                <ShoppingCart className="w-5 h-5" />
              </Link>
              {cartCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.div>

            {/* User Avatar Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="User menu"
              >
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 glass dark:glass-dark rounded-lg shadow-lg overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-semibold text-sm">Rahul Kumar</p>
                      <p className="text-xs text-gray-500">₹ 247.50 wallet</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <button className="w-full text-left px-3 py-2 hover:bg-white/10 rounded transition-colors text-sm flex items-center gap-2">
                        <Wallet className="w-4 h-4" /> Wallet
                      </button>
                      <button className="w-full text-left px-3 py-2 hover:bg-white/10 rounded transition-colors text-sm flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Settings
                      </button>
                      <button className="w-full text-left px-3 py-2 hover:bg-white/10 rounded transition-colors text-sm flex items-center gap-2 text-red-500">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.nav>
    );
  }

  // Mobile Bottom Navigation
  return (
    <motion.div
      className={`fixed bottom-0 left-0 right-0 z-50 ${
        isDark ? 'glass-dark' : 'glass'
      } border-t border-gray-200 dark:border-gray-700`}
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {navItems.map((item, idx) => (
          <motion.div
            key={item.label}
            whileTap={{ scale: 0.9 }}
          >
            {item.path.startsWith('#') ? (
              <button
                className={`w-full py-3 flex flex-col items-center justify-center text-xs font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-orange-500'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                {item.label}
              </button>
            ) : (
              <Link
                to={item.path}
                className={`w-full py-3 flex flex-col items-center justify-center text-xs font-medium transition-colors ${
                  location.pathname.includes(item.path.split('/')[1])
                    ? 'text-orange-500'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                {item.label}
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Navbar;
