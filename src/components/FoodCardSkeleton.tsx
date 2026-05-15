import { motion } from 'framer-motion';

export default function FoodCardSkeleton() {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-card dark:shadow-none dark:border dark:border-gray-700"
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      {/* Image Skeleton */}
      <div className="h-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse" />

      {/* Content Skeleton */}
      <div className="p-3 space-y-3">
        {/* Title Skeleton */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />

        {/* Rating Skeleton */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            />
          ))}
          <div className="ml-1 w-6 h-3.5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}
