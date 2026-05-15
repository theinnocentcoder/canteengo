export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isVeg: boolean;
  isTrending: boolean;
  isSpecial: boolean;
  prepTime: number; // in minutes
  calories: number;
  tags: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
  price: number;
}

export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'picked';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  queuePosition: number;
  estimatedTime: number; // in minutes
  qrCode?: string;
  createdAt: Date;
  pickupTime?: Date;
}

export type LoyaltyTier = 'bronze' | 'silver' | 'gold';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  walletBalance: number;
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  ordersCount: number;
  createdAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  menuItemId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  timestamp: Date;
  balance: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order_ready' | 'special_offer' | 'loyalty_reward' | 'payment_success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}
