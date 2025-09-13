-- Create hire_bookings table for car hire and boat cruise services
CREATE TABLE IF NOT EXISTS hire_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('car', 'boat')),
  service_name VARCHAR(255) NOT NULL,
  service_price DECIMAL(10,2) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  passengers INTEGER DEFAULT 1,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  pickup_address TEXT,
  special_requests TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_reference VARCHAR(255),
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hire_bookings_user_id ON hire_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_hire_bookings_service_type ON hire_bookings(service_type);
CREATE INDEX IF NOT EXISTS idx_hire_bookings_status ON hire_bookings(status);
CREATE INDEX IF NOT EXISTS idx_hire_bookings_booking_date ON hire_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_hire_bookings_created_at ON hire_bookings(created_at);

-- Enable Row Level Security
ALTER TABLE hire_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for hire_bookings
CREATE POLICY "Users can view their own hire bookings" ON hire_bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own hire bookings" ON hire_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hire bookings" ON hire_bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all hire bookings" ON hire_bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all hire bookings" ON hire_bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete hire bookings" ON hire_bookings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_hire_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hire_bookings_updated_at
  BEFORE UPDATE ON hire_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_hire_bookings_updated_at();
