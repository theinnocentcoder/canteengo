import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, Clock, Wallet, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fadeInUp, staggerContainer, scaleIn, slideInRight } from '@/lib/animations';

const LandingPage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero Section
  const HeroSection = () => (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-hero opacity-90" />
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 text-6xl opacity-40"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🍔
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-5xl opacity-40"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          🍕
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-1/4 text-5xl opacity-40"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          🍜
        </motion.div>
        <motion.div
          className="absolute bottom-40 right-1/4 text-6xl opacity-40"
          animate={{ y: [0, 25, 0] }}
          transition={{ duration: 4.5, repeat: Infinity }}
        >
          🍰
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0 }}
            >
              Campus Food,
            </motion.span>{' '}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Delivered
            </motion.span>{' '}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gradient"
            >
              Fast
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
          >
            Skip the queue, order ahead, and pick up hot food in minutes. Join 2000+ students already ordering smarter.
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-6 md:gap-12 text-white text-center py-6"
          >
            <div>
              <p className="text-2xl md:text-3xl font-bold">2000+</p>
              <p className="text-sm md:text-base opacity-90">Students</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold">50+</p>
              <p className="text-sm md:text-base opacity-90">Delicious Items</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold">~5 min</p>
              <p className="text-sm md:text-base opacity-90">Avg Pickup</p>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
          >
            <Link to="/student">
              <button className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group">
                Order Now
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="btn-ghost w-full sm:w-auto">How it Works</button>
          </motion.div>
        </motion.div>

        {/* Phone Mockup */}
        <motion.div
          className="mt-12 md:mt-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="relative inline-block">
            <div className="w-48 h-96 md:w-64 md:h-auto bg-gray-800 rounded-3xl border-8 border-gray-900 shadow-2xl p-4">
              <div className="w-full h-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl mb-4">📱</p>
                  <p className="text-white font-semibold">App Preview</p>
                </div>
              </div>
            </div>
            <motion.div
              className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-full p-3 shadow-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Zap className="w-6 h-6" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );

  // Features Section
  const FeaturesSection = () => (
    <section className="py-20 md:py-32 px-4 md:px-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose CanteenGo?</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Everything you need for hassle-free campus dining</p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              icon: '⏭️',
              title: 'Skip the Queue',
              desc: 'Order online and pick up when ready. No more waiting in long lines.',
            },
            {
              icon: '📍',
              title: 'Real-time Tracking',
              desc: 'Track your order status and queue position live. Get notified when ready.',
            },
            {
              icon: '💰',
              title: 'Smart Wallet',
              desc: 'Earn loyalty points, redeem rewards, and manage balance easily.',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-card hover:shadow-lg transition-shadow"
            >
              <p className="text-5xl mb-4">{feature.icon}</p>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );

  // Trending Today Section
  const TrendingSection = () => (
    <section className="py-20 md:py-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">🔥 Trending Today</h2>
          <motion.div whileHover={{ x: 4 }} className="flex items-center gap-2 text-orange-500 cursor-pointer">
            See all <ChevronRight className="w-5 h-5" />
          </motion.div>
        </motion.div>

        <motion.div
          className="overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex gap-6 w-max">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-card snap-center"
              >
                <div className="relative w-full h-40 bg-gradient-orange overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${1550000000000 + idx}?w=400&h=300&fit=crop`}
                    alt="Food"
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    🔥 Trending
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">Paneer Tikka Biryani</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.8 (342)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-500">₹220</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      + Add
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );

  // How It Works Section
  const HowItWorksSection = () => (
    <section className="py-20 md:py-32 px-4 md:px-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          How It Works
        </motion.h2>

        <div className="space-y-8">
          {[
            { step: 1, icon: '🔍', title: 'Browse & Choose', desc: 'Explore 50+ delicious items from our canteen.' },
            { step: 2, icon: '💳', title: 'Pay with Wallet', desc: 'Quick, secure checkout with your CanteenGo wallet.' },
            { step: 3, icon: '📍', title: 'Pick Up Ready', desc: 'Get notified when your order is ready. Collect at counter.' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="flex gap-6 md:gap-12 items-start"
            >
              <div className="flex-shrink-0">
                <motion.div
                  className="w-16 h-16 md:w-20 md:h-20 bg-gradient-orange rounded-full flex items-center justify-center text-3xl md:text-4xl"
                  whileHover={{ scale: 1.1 }}
                >
                  {item.icon}
                </motion.div>
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-xl md:text-2xl font-semibold mb-2">
                  Step {item.step}: {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  // Testimonials Section
  const TestimonialsSection = () => (
    <section className="py-20 md:py-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Loved by Students
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { name: 'Priya Sharma', role: 'CSE', quote: 'No more skipping meals! CanteenGo saved my exam week.' },
            { name: 'Arjun Kapoor', role: 'ECE', quote: 'Best app for campus dining. Fast, reliable, and amazing food.' },
            { name: 'Neha Singh', role: 'MBA', quote: 'Finally, a solution that gets campus food ordering right!' },
          ].map((testimonial, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="bg-gradient-card rounded-2xl p-6 md:p-8 shadow-card"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role} Student</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );

  // CTA Section
  const CTASection = () => (
    <section className="py-20 md:py-32 px-4 md:px-8 gradient-hero">
      <div className="max-w-4xl mx-auto text-center text-white">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Ready to order? Join 2000+ students
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl opacity-90 mb-8"
        >
          Start ordering smarter today and never skip a meal again.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link to="/student">
            <button className="bg-white text-orange-500 font-semibold px-8 py-4 rounded-2xl hover:opacity-90 transition-all inline-flex items-center gap-2 group">
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <HeroSection />
      <FeaturesSection />
      <TrendingSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default LandingPage;
