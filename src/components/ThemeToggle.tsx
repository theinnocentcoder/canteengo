import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'icon' | 'button' | 'pill';
}

/**
 * Beautiful theme toggle component with smooth animations
 * 
 * Usage:
 * <ThemeToggle variant="icon" />
 * <ThemeToggle variant="button" showLabel />
 * <ThemeToggle variant="pill" />
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
  variant = 'icon',
}) => {
  const { isDark, toggleTheme } = useTheme();

  const baseClasses = 'transition-all duration-300';

  // Icon only variant (compact)
  if (variant === 'icon') {
    return (
      <motion.button
        onClick={toggleTheme}
        className={`p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-full ${baseClasses} ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Sun className="w-5 h-5 text-yellow-500" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Moon className="w-5 h-5 text-indigo-600" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  // Button variant with label
  if (variant === 'button') {
    return (
      <motion.button
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 ${baseClasses} ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Sun className="w-4 h-4 text-yellow-500" />
              {showLabel && <span className="text-sm font-medium">Light</span>}
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Moon className="w-4 h-4 text-indigo-600" />
              {showLabel && <span className="text-sm font-medium">Dark</span>}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  // Pill/Switch variant (modern toggle switch style)
  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full ${
        isDark ? 'bg-indigo-600' : 'bg-gray-300'
      } ${baseClasses} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
        animate={{
          left: isDark ? 24 : 4,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-3 h-3 text-yellow-500" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-3 h-3 text-indigo-600" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
