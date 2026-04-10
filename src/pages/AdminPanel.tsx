import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, TrendingUp, Users, DollarSign, ShoppingBag } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Navbar from '@/components/Navbar';
import type { Tables } from '@/integrations/supabase/types';

type MenuItem = Tables<'menu_items'>;

export default function AdminPanel() {
  const [tab, setTab] = useState('analytics');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6">
        <h1 className="font-heading text-2xl font-bold mb-6">Admin Panel</h1>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="slots">Time Slots</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          <TabsContent value="analytics"><AnalyticsDashboard /></TabsContent>
          <TabsContent value="menu"><MenuManagement /></TabsContent>
          <TabsContent value="slots"><SlotManagement /></TabsContent>
          <TabsContent value="users"><UserManagement /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AnalyticsDashboard() {
  const [stats, setStats] = useState({ todayRevenue: 0, weekRevenue: 0, totalOrders: 0, totalUsers: 0 });
  const [topItems, setTopItems] = useState<any[]>([]);
  const [ordersBySlot, setOrdersBySlot] = useState<any[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Revenue today
      const { data: todayOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', today)
        .neq('status', 'Cancelled');
      const todayRevenue = todayOrders?.reduce((s, o) => s + Number(o.total_amount), 0) ?? 0;

      // Revenue this week
      const { data: weekOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', weekAgo)
        .neq('status', 'Cancelled');
      const weekRevenue = weekOrders?.reduce((s, o) => s + Number(o.total_amount), 0) ?? 0;

      // Total orders
      const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true });

      // Total users
      const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

      setStats({ todayRevenue, weekRevenue, totalOrders: totalOrders ?? 0, totalUsers: totalUsers ?? 0 });

      // Top selling items
      const { data: orderItems } = await supabase.from('order_items').select('menu_item_id, quantity, menu_items:menu_item_id(name)');
      const itemMap: Record<string, { name: string; qty: number }> = {};
      orderItems?.forEach((oi: any) => {
        const id = oi.menu_item_id;
        if (!itemMap[id]) itemMap[id] = { name: oi.menu_items?.name ?? '', qty: 0 };
        itemMap[id].qty += oi.quantity;
      });
      const sorted = Object.values(itemMap).sort((a, b) => b.qty - a.qty).slice(0, 5);
      setTopItems(sorted.map(i => ({ name: i.name, orders: i.qty })));

      // Orders by slot
      const { data: allOrders } = await supabase.from('orders').select('slot_id, time_slots:slot_id(start_time, end_time)');
      const slotMap: Record<string, number> = {};
      allOrders?.forEach((o: any) => {
        const key = `${o.time_slots?.start_time?.slice(0,5)}-${o.time_slots?.end_time?.slice(0,5)}`;
        slotMap[key] = (slotMap[key] || 0) + 1;
      });
      setOrdersBySlot(Object.entries(slotMap).map(([slot, count]) => ({ slot, orders: count })));

      // Status breakdown
      const { data: statusData } = await supabase.from('orders').select('status');
      const sMap: Record<string, number> = {};
      statusData?.forEach((o: any) => { sMap[o.status] = (sMap[o.status] || 0) + 1; });
      setStatusBreakdown(Object.entries(sMap).map(([name, value]) => ({ name, value })));

      setLoading(false);
    };
    fetch();
  }, []);

  const COLORS = ['#DC2626', '#EAB308', '#F87171', '#FBBF24', '#FCA5A5'];

  if (loading) return <div className="space-y-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Today\'s Revenue', value: `₹${stats.todayRevenue}`, icon: DollarSign },
          { label: 'Weekly Revenue', value: `₹${stats.weekRevenue}`, icon: TrendingUp },
          { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag },
          { label: 'Total Users', value: stats.totalUsers, icon: Users },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <s.icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="font-heading text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Top 5 Selling Items</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topItems}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#DC2626" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Orders by Slot</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ordersBySlot}>
                <XAxis dataKey="slot" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#EAB308" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Order Status Breakdown</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {statusBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MenuManagement() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<MenuItem> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase.from('menu_items').select('*').order('category');
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    if (!editItem?.name || !editItem?.category || !editItem?.price) {
      toast.error('Fill required fields');
      return;
    }

    if (editItem.id) {
      await supabase.from('menu_items').update({
        name: editItem.name,
        category: editItem.category,
        price: editItem.price,
        calories: editItem.calories,
        image_url: editItem.image_url,
        is_available: editItem.is_available,
      }).eq('id', editItem.id);
      toast.success('Item updated');
    } else {
      await supabase.from('menu_items').insert({
        name: editItem.name,
        category: editItem.category,
        price: editItem.price,
        calories: editItem.calories ?? null,
        image_url: editItem.image_url ?? null,
        is_available: editItem.is_available ?? true,
      });
      toast.success('Item added');
    }
    setDialogOpen(false);
    setEditItem(null);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('menu_items').delete().eq('id', id);
    toast.success('Item deleted');
    fetchItems();
  };

  const toggleAll = async (available: boolean) => {
    for (const item of items) {
      await supabase.from('menu_items').update({ is_available: available }).eq('id', item.id);
    }
    toast.success(`All items marked ${available ? 'available' : 'unavailable'}`);
    fetchItems();
  };

  if (loading) return <Skeleton className="h-64" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => toggleAll(true)}>All Available</Button>
          <Button size="sm" variant="outline" onClick={() => toggleAll(false)}>All Unavailable</Button>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setEditItem({ is_available: true })}>
              <Plus className="mr-1 h-4 w-4" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editItem?.id ? 'Edit' : 'Add'} Menu Item</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name *</Label><Input value={editItem?.name ?? ''} onChange={e => setEditItem(p => ({ ...p, name: e.target.value }))} /></div>
              <div><Label>Category *</Label>
                <Select value={editItem?.category ?? ''} onValueChange={v => setEditItem(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {['Breakfast','Lunch','Snacks','Beverages'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Price *</Label><Input type="number" value={editItem?.price ?? ''} onChange={e => setEditItem(p => ({ ...p, price: Number(e.target.value) }))} /></div>
              <div><Label>Calories</Label><Input type="number" value={editItem?.calories ?? ''} onChange={e => setEditItem(p => ({ ...p, calories: Number(e.target.value) }))} /></div>
              <div><Label>Image URL</Label><Input value={editItem?.image_url ?? ''} onChange={e => setEditItem(p => ({ ...p, image_url: e.target.value }))} /></div>
              <div className="flex items-center gap-2">
                <Switch checked={editItem?.is_available ?? true} onCheckedChange={v => setEditItem(p => ({ ...p, is_available: v }))} />
                <Label>Available</Label>
              </div>
              <Button className="w-full" onClick={handleSave}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{item.category}</Badge>
                    <Badge variant={item.is_available ? 'default' : 'destructive'}>
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-primary font-bold">₹{item.price}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => { setEditItem(item); setDialogOpen(true); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SlotManagement() {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSlot, setNewSlot] = useState({ start_time: '', end_time: '', max_capacity: 50 });

  const fetchSlots = async () => {
    const { data } = await supabase.from('time_slots').select('*').order('start_time');
    setSlots(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchSlots(); }, []);

  const addSlot = async () => {
    if (!newSlot.start_time || !newSlot.end_time) { toast.error('Set start and end times'); return; }
    await supabase.from('time_slots').insert({
      start_time: newSlot.start_time,
      end_time: newSlot.end_time,
      max_capacity: newSlot.max_capacity,
    });
    toast.success('Slot created');
    setNewSlot({ start_time: '', end_time: '', max_capacity: 50 });
    fetchSlots();
  };

  const toggleSlot = async (id: string, active: boolean) => {
    await supabase.from('time_slots').update({ is_active: active }).eq('id', id);
    fetchSlots();
  };

  const deleteSlot = async (id: string) => {
    await supabase.from('time_slots').delete().eq('id', id);
    toast.success('Slot deleted');
    fetchSlots();
  };

  if (loading) return <Skeleton className="h-64" />;

  return (
    <div>
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-heading font-semibold mb-3">Add New Slot</h3>
          <div className="flex gap-3 flex-wrap items-end">
            <div><Label>Start</Label><Input type="time" value={newSlot.start_time} onChange={e => setNewSlot(s => ({ ...s, start_time: e.target.value }))} /></div>
            <div><Label>End</Label><Input type="time" value={newSlot.end_time} onChange={e => setNewSlot(s => ({ ...s, end_time: e.target.value }))} /></div>
            <div><Label>Capacity</Label><Input type="number" className="w-20" value={newSlot.max_capacity} onChange={e => setNewSlot(s => ({ ...s, max_capacity: Number(e.target.value) }))} /></div>
            <Button onClick={addSlot}><Plus className="mr-1 h-4 w-4" /> Add</Button>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {slots.map(slot => (
          <Card key={slot.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{slot.start_time?.slice(0,5)} – {slot.end_time?.slice(0,5)}</p>
                <p className="text-sm text-muted-foreground">{slot.current_count}/{slot.max_capacity} booked • {slot.slot_date}</p>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={slot.is_active} onCheckedChange={v => toggleSlot(slot.id, v)} />
                <Button size="icon" variant="ghost" onClick={() => deleteSlot(slot.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setUsers(data ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <Skeleton className="h-64" />;

  return (
    <div className="space-y-3">
      {users.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No users registered yet.</p>
      ) : users.map(u => (
        <Card key={u.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-muted-foreground">{u.email}</p>
              {u.dept && <p className="text-xs text-muted-foreground">Dept: {u.dept}</p>}
            </div>
            <p className="text-sm font-medium text-primary">₹{Number(u.wallet_balance).toFixed(2)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
