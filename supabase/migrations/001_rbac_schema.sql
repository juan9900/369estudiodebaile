-- ============================================================
-- 369 Estudio de Baile – RBAC Schema Migration
-- Run this in the Supabase SQL Editor (once, in order)
-- ============================================================

-- 1. User role enum
CREATE TYPE user_role AS ENUM ('customer', 'admin');

-- 2. Profiles table (links to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Dance classes table
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_capacity INTEGER DEFAULT 20,
  current_enrollment INTEGER DEFAULT 0,
  price DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Registrations table
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'attended')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, class_id)
);

-- 5. Trigger: auto-create profile on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 6. Helper function (SECURITY DEFINER to bypass RLS on profiles)
-- ============================================================
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================
-- 7. Row Level Security Policies
-- ============================================================

-- --- profiles ---
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Customers see only their own profile
CREATE POLICY "profiles: own profile read" ON profiles
  FOR SELECT USING (id = auth.uid());

-- Customers can update only their own profile (not the role column)
CREATE POLICY "profiles: own profile update" ON profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = public.current_user_role());

-- Admins can read all profiles
CREATE POLICY "profiles: admin read all" ON profiles
  FOR SELECT USING (public.current_user_role() = 'admin');

-- Admins can update any profile (including role promotion)
CREATE POLICY "profiles: admin update all" ON profiles
  FOR UPDATE USING (public.current_user_role() = 'admin');

-- --- classes ---
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Everyone (authenticated) can read active classes
CREATE POLICY "classes: read active" ON classes
  FOR SELECT USING (is_active = true OR public.current_user_role() = 'admin');

-- Only admins can insert classes
CREATE POLICY "classes: admin insert" ON classes
  FOR INSERT WITH CHECK (public.current_user_role() = 'admin');

-- Only admins can update classes
CREATE POLICY "classes: admin update" ON classes
  FOR UPDATE USING (public.current_user_role() = 'admin');

-- Only admins can delete classes
CREATE POLICY "classes: admin delete" ON classes
  FOR DELETE USING (public.current_user_role() = 'admin');

-- --- registrations ---
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Customers can read only their own registrations
CREATE POLICY "registrations: own read" ON registrations
  FOR SELECT USING (user_id = auth.uid());

-- Customers can insert their own registrations
CREATE POLICY "registrations: own insert" ON registrations
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Customers can update only their own registrations
CREATE POLICY "registrations: own update" ON registrations
  FOR UPDATE USING (user_id = auth.uid());

-- Admins can read all registrations
CREATE POLICY "registrations: admin read all" ON registrations
  FOR SELECT USING (public.current_user_role() = 'admin');

-- Admins can update all registrations (confirm / cancel / mark attended)
CREATE POLICY "registrations: admin update all" ON registrations
  FOR UPDATE USING (public.current_user_role() = 'admin');

-- ============================================================
-- 7. First admin promotion (run AFTER a user has signed up)
--    Replace the email below with the actual admin email.
-- ============================================================
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@youremail.com';
