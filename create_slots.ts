import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import ws from 'ws';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false }, global: { fetch: fetch }, realtime: { transport: ws } as any });

async function createSlots() {
  const today = new Date().toISOString().split('T')[0];
  const slots = [
    { slot_date: today, start_time: '20:00:00', end_time: '20:30:00', max_capacity: 50, current_count: 0, is_active: true },
    { slot_date: today, start_time: '21:00:00', end_time: '21:30:00', max_capacity: 50, current_count: 0, is_active: true },
    { slot_date: today, start_time: '22:00:00', end_time: '22:30:00', max_capacity: 50, current_count: 0, is_active: true },
    { slot_date: today, start_time: '23:00:00', end_time: '23:30:00', max_capacity: 50, current_count: 0, is_active: true },
  ];
  
  const { error } = await supabase.from('time_slots').insert(slots);
  if (error) {
    console.error('Failed to create slots:', error);
  } else {
    console.log('Slots created successfully.');
  }
}
createSlots();
