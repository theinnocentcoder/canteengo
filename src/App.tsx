import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "@/components/layout/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import RegisterPage from "@/pages/RegisterPage";
import StudentDashboard from "@/pages/StudentDashboard";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderDetailPage from "@/pages/OrderDetailPage";
import OrdersPage from "@/pages/OrdersPage";
import WalletPage from "@/pages/WalletPage";
import NotificationsPage from "@/pages/NotificationsPage";
import RatePage from "@/pages/RatePage";
import StaffDashboard from "@/pages/StaffDashboard";
import CashierPortal from "@/pages/CashierPortal";
import AdminPanel from "@/pages/AdminPanel";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Desktop Navbar - Always visible */}
      <Navbar isMobile={false} />
      
      {/* Mobile Bottom Navigation - Only visible on mobile */}
      {isMobile && <Navbar isMobile={true} />}

      {/* Main Content with padding for navbar */}
      <main className="pt-20 md:pt-16 pb-24 md:pb-0">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute allowedRoles={['student']}><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute allowedRoles={['student']}><CheckoutPage /></ProtectedRoute>} />
          <Route path="/order/:id" element={<ProtectedRoute allowedRoles={['student']}><OrderDetailPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute allowedRoles={['student']}><OrdersPage /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute allowedRoles={['student']}><WalletPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute allowedRoles={['student']}><NotificationsPage /></ProtectedRoute>} />
          <Route path="/rate/:orderId" element={<ProtectedRoute allowedRoles={['student']}><RatePage /></ProtectedRoute>} />
          <Route path="/staff" element={<ProtectedRoute allowedRoles={['staff']}><StaffDashboard /></ProtectedRoute>} />
          <Route path="/cashier" element={<ProtectedRoute allowedRoles={['cashier']}><CashierPortal /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <AppRoutes />
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
