import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import ws from 'ws';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
// Use the secret key to bypass RLS
const supabaseServiceKey = '';
const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false }, global: { fetch: fetch }, realtime: { transport: ws } as any });

async function seedData() {
  console.log('Seeding menu items...');
  const { error: menuError } = await supabase.from('menu_items').insert([
    {
      name: 'Margherita Pizza',
      category: 'Pizza',
      price: 12.99,
      calories: 800,
      image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500',
      is_available: true,
    },
    {
      name: 'Classic Burger',
      category: 'Burger',
      price: 8.99,
      calories: 600,
      image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
      is_available: true,
    },
    {
      name: 'Caesar Salad',
      category: 'Salad',
      price: 7.99,
      calories: 300,
      image_url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500',
      is_available: true,
    }
  ]);

  if (menuError) {
    console.error('Failed to seed menu items:', menuError);
  } else {
    console.log('Menu items seeded successfully.');
  }

  console.log('Seeding time slots...');
  const today = new Date().toISOString().split('T')[0];
  const { error: slotsError } = await supabase.from('time_slots').insert([
    {
      slot_date: today,
      start_time: '12:00:00',
      end_time: '12:30:00',
      max_capacity: 50,
      current_count: 0,
      is_active: true,
    },
    {
      slot_date: today,
      start_time: '12:30:00',
      end_time: '13:00:00',
      max_capacity: 50,
      current_count: 0,
      is_active: true,
    },
    {
      slot_date: today,
      start_time: '13:00:00',
      end_time: '13:30:00',
      max_capacity: 50,
      current_count: 0,
      is_active: true,
    }
  ]);

  if (slotsError) {
    console.error('Failed to seed time slots:', slotsError);
  } else {
    console.log('Time slots seeded successfully.');
  }
}

seedData();
