import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import ws from 'ws';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false }, global: { fetch: fetch }, realtime: { transport: ws } as any });

async function testFlow() {
  const email = `test_${Date.now()}@college.edu`;
  const password = 'password123';

  console.log('Testing Registration...');
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error('Registration failed:', authError.message);
    return;
  }
  console.log('Registered user ID:', authData.user?.id);

  if (!authData.user) return;

  console.log('Testing Profile Creation...');
  const { error: profileError } = await supabase.from('profiles').insert({
    user_id: authData.user.id,
    name: 'Test User',
    email: email,
    dept: 'CS',
    phone: '1234567890',
  });

  if (profileError) {
    console.error('Profile creation failed:', profileError);
  } else {
    console.log('Profile created successfully');
  }

  console.log('Testing Role Creation...');
  const { error: roleError } = await supabase.from('user_roles').insert({
    user_id: authData.user.id,
    role: 'student',
  });

  if (roleError) {
    console.error('Role creation failed:', roleError);
  } else {
    console.log('Role created successfully');
  }

  console.log('Testing Login...');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    console.error('Login failed:', loginError.message);
  } else {
    console.log('Login successful');
  }
  
  console.log('Fetching role for login redirect test...');
  if (loginData.user) {
    const { data: roleData, error: roleFetchError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', loginData.user.id)
      .maybeSingle();
      
    if (roleFetchError) {
      console.error('Role fetch failed:', roleFetchError);
    } else {
      console.log('Role fetched:', roleData?.role);
    }
  }
}

testFlow();
