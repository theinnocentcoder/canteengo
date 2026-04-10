
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('student', 'staff', 'cashier', 'admin');

-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('Placed', 'Preparing', 'Ready', 'Collected', 'Cancelled');

-- Create payment mode enum
CREATE TYPE public.payment_mode AS ENUM ('wallet', 'cash');

-- Create payment status enum  
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'refunded');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own role on signup" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  dept TEXT,
  phone TEXT,
  wallet_balance NUMERIC(10,2) NOT NULL DEFAULT 500.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can view student profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Cashier can view profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'cashier'));

-- Menu items table
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  calories INTEGER,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  avg_rating NUMERIC(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view menu" ON public.menu_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert menu items" ON public.menu_items FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update menu items" ON public.menu_items FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete menu items" ON public.menu_items FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Time slots table
CREATE TABLE public.time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_capacity INTEGER NOT NULL DEFAULT 50,
  current_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view slots" ON public.time_slots FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert slots" ON public.time_slots FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update slots" ON public.time_slots FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete slots" ON public.time_slots FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slot_id UUID REFERENCES public.time_slots(id) NOT NULL,
  order_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  status order_status NOT NULL DEFAULT 'Placed',
  total_amount NUMERIC(10,2) NOT NULL,
  qr_token TEXT NOT NULL UNIQUE,
  payment_mode payment_mode NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own orders" ON public.orders FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update own orders" ON public.orders FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Staff can view all orders" ON public.orders FOR SELECT USING (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Staff can update orders" ON public.orders FOR UPDATE USING (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Cashier can view all orders" ON public.orders FOR SELECT USING (public.has_role(auth.uid(), 'cashier'));
CREATE POLICY "Cashier can update orders" ON public.orders FOR UPDATE USING (public.has_role(auth.uid(), 'cashier'));
CREATE POLICY "Admin can view all orders" ON public.orders FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  menu_item_id UUID REFERENCES public.menu_items(id) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(10,2) NOT NULL
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.student_id = auth.uid())
);
CREATE POLICY "Students can insert order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.student_id = auth.uid())
);
CREATE POLICY "Staff can view order items" ON public.order_items FOR SELECT USING (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Cashier can view order items" ON public.order_items FOR SELECT USING (public.has_role(auth.uid(), 'cashier'));
CREATE POLICY "Admin can view order items" ON public.order_items FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  mode payment_mode NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own payments" ON public.payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND orders.student_id = auth.uid())
);
CREATE POLICY "Students can insert payments" ON public.payments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND orders.student_id = auth.uid())
);
CREATE POLICY "Admin can view all payments" ON public.payments FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Anyone authenticated can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

-- Ratings table
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, menu_item_id, order_id)
);
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings" ON public.ratings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Students can insert own ratings" ON public.ratings FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Enable realtime on orders and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Function to increment time slot count
CREATE OR REPLACE FUNCTION public.increment_slot_count(slot_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.time_slots SET current_count = current_count + 1 WHERE id = slot_uuid;
END;
$$;

-- Function to decrement time slot count
CREATE OR REPLACE FUNCTION public.decrement_slot_count(slot_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.time_slots SET current_count = GREATEST(current_count - 1, 0) WHERE id = slot_uuid;
END;
$$;

-- Function to deduct wallet balance
CREATE OR REPLACE FUNCTION public.deduct_wallet(user_uuid UUID, amount NUMERIC)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles SET wallet_balance = wallet_balance - amount WHERE user_id = user_uuid;
END;
$$;

-- Function to refund wallet balance
CREATE OR REPLACE FUNCTION public.refund_wallet(user_uuid UUID, amount NUMERIC)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles SET wallet_balance = wallet_balance + amount WHERE user_id = user_uuid;
END;
$$;

-- Function to update avg_rating on menu_items
CREATE OR REPLACE FUNCTION public.update_menu_item_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.menu_items 
  SET avg_rating = (SELECT COALESCE(AVG(rating), 0) FROM public.ratings WHERE menu_item_id = NEW.menu_item_id)
  WHERE id = NEW.menu_item_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_rating_trigger
AFTER INSERT ON public.ratings
FOR EACH ROW EXECUTE FUNCTION public.update_menu_item_rating();
