import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Plus, Minus, Star, Flame } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import type { Tables } from '@/integrations/supabase/types';

type MenuItem = Tables<'menu_items'>;

export default function StudentDashboard() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem, items: cartItems, updateQuantity } = useCart();
  const { profile } = useAuth();

  useEffect(() => {
    const fetchMenu = async () => {
      const { data } = await supabase.from('menu_items').select('*').eq('is_available', true).order('category');
      setItems(data ?? []);
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))];

  const getCartQty = (id: string) => cartItems.find(c => c.id === id)?.quantity ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold">Hey, {profile?.name?.split(' ')[0]} 👋</h1>
          <p className="text-muted-foreground">What would you like to eat today?</p>
        </div>

        {/* Wallet card */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/10 to-accent/30">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">Wallet Balance</p>
              <p className="font-heading text-2xl font-bold text-primary">₹{profile?.wallet_balance?.toFixed(2)}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/orders'}>
              My Orders
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="All">
          <TabsList className="mb-4 flex-wrap">
            {categories.map(c => (
              <TabsTrigger key={c} value={c}>{c}</TabsTrigger>
            ))}
          </TabsList>
          {categories.map(cat => (
            <TabsContent key={cat} value={cat}>
              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-48 rounded-lg" />)}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.filter(i => cat === 'All' || i.category === cat).map(item => {
                    const qty = getCartQty(item.id);
                    return (
                      <Card key={item.id} className="overflow-hidden transition-shadow hover:shadow-md animate-fade-in">
                        <div className="h-36 bg-muted overflow-hidden">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">No Image</div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-heading font-semibold">{item.name}</h3>
                              <div className="mt-1 flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                                {item.calories && (
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Flame className="h-3 w-3" />{item.calories} cal
                                  </span>
                                )}
                              </div>
                              {Number(item.avg_rating) > 0 && (
                                <div className="mt-1 flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-primary text-primary" />
                                  <span className="text-xs text-muted-foreground">{Number(item.avg_rating).toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                            <p className="font-heading text-lg font-bold text-primary">₹{item.price}</p>
                          </div>
                          <div className="mt-3 flex items-center justify-end gap-2">
                            {qty > 0 ? (
                              <div className="flex items-center gap-2">
                                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(item.id, qty - 1)}>
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-6 text-center font-medium">{qty}</span>
                                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(item.id, qty + 1)} disabled={qty >= 10}>
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button size="sm" onClick={() => {
                                addItem({ id: item.id, name: item.name, price: item.price, calories: item.calories, image_url: item.image_url });
                                toast.success(`${item.name} added to cart`);
                              }}>
                                <Plus className="mr-1 h-4 w-4" /> Add
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
              {!loading && items.filter(i => cat === 'All' || i.category === cat).length === 0 && (
                <div className="py-12 text-center text-muted-foreground">No items available in this category.</div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
