import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Trash2, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import type { Tables } from '@/integrations/supabase/types';

type TimeSlot = Tables<'time_slots'>;

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const { user, profile, refreshProfile } = useAuth();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [paymentMode, setPaymentMode] = useState<'wallet' | 'cash'>('wallet');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlots = async () => {
      const { data } = await supabase
        .from('time_slots')
        .select('*')
        .eq('is_active', true)
        .eq('slot_date', new Date().toISOString().split('T')[0]);
      setSlots(data ?? []);
    };
    fetchSlots();
  }, []);

  const isSlotBlocked = (slot: TimeSlot) => {
    const now = new Date();
    const [h, m] = slot.start_time.split(':').map(Number);
    const slotStart = new Date();
    slotStart.setHours(h, m, 0, 0);
    return (slotStart.getTime() - now.getTime()) < 15 * 60 * 1000;
  };

  const generateToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = 'CG-';
    for (let i = 0; i < 8; i++) token += chars[Math.floor(Math.random() * chars.length)];
    return token;
  };

  const handlePlaceOrder = async () => {
    if (!selectedSlot) { toast.error('Please select a pickup time slot'); return; }
    if (items.length === 0) { toast.error('Cart is empty'); return; }
    if (!user) return;

    const slot = slots.find(s => s.id === selectedSlot);
    if (!slot) return;
    if (slot.current_count >= slot.max_capacity) { toast.error('This slot is full'); return; }
    if (isSlotBlocked(slot)) { toast.error('Too late to order for this slot (< 15 min)'); return; }

    if (paymentMode === 'wallet' && (profile?.wallet_balance ?? 0) < total) {
      toast.error('Insufficient wallet balance');
      return;
    }

    setLoading(true);
    const qrToken = generateToken();

    const { data: order, error: orderError } = await supabase.from('orders').insert({
      student_id: user.id,
      slot_id: selectedSlot,
      total_amount: total,
      qr_token: qrToken,
      payment_mode: paymentMode,
      status: 'Placed',
    }).select().single();

    if (orderError || !order) {
      toast.error('Failed to place order: ' + (orderError?.message ?? 'Unknown error'));
      setLoading(false);
      return;
    }

    // Insert order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      menu_item_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));
    await supabase.from('order_items').insert(orderItems);

    // Insert payment
    await supabase.from('payments').insert({
      order_id: order.id,
      amount: total,
      mode: paymentMode,
      status: paymentMode === 'wallet' ? 'completed' : 'pending',
      transaction_id: paymentMode === 'wallet' ? `WAL-${Date.now()}` : null,
    });

    // Deduct wallet if applicable
    if (paymentMode === 'wallet') {
      await supabase.rpc('deduct_wallet', { user_uuid: user.id, amount: total });
      await refreshProfile();
    }

    // Increment slot count
    await supabase.rpc('increment_slot_count', { slot_uuid: selectedSlot });

    clearCart();
    toast.success('Order placed successfully!');
    navigate(`/order/${order.id}`);
    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container flex flex-col items-center justify-center py-20">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
          <h2 className="mt-4 font-heading text-xl font-semibold">Your cart is empty</h2>
          <p className="text-muted-foreground">Add some delicious items from the menu</p>
          <Button className="mt-4" onClick={() => navigate('/student')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl py-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/student')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
        </Button>
        <h1 className="font-heading text-2xl font-bold mb-4">Your Cart</h1>

        <div className="space-y-3">
          {items.map(item => (
            <Card key={item.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">₹{item.price} × {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={String(item.quantity)} onValueChange={v => updateQuantity(item.id, Number(v))}>
                    <SelectTrigger className="w-16 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="w-16 text-right font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">₹{total.toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Pickup Time Slot</label>
              <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                <SelectTrigger><SelectValue placeholder="Select slot" /></SelectTrigger>
                <SelectContent>
                  {slots.map(slot => (
                    <SelectItem key={slot.id} value={slot.id} disabled={isSlotBlocked(slot) || slot.current_count >= slot.max_capacity}>
                      {slot.start_time.slice(0,5)} – {slot.end_time.slice(0,5)} ({slot.current_count}/{slot.max_capacity})
                      {isSlotBlocked(slot) ? ' (Closed)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <Select value={paymentMode} onValueChange={v => setPaymentMode(v as 'wallet' | 'cash')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="wallet">Wallet (₹{profile?.wallet_balance?.toFixed(2)})</SelectItem>
                  <SelectItem value="cash">Cash on Pickup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Place Order'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
