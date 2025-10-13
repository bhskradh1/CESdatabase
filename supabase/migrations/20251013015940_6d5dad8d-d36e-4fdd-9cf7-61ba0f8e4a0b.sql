-- Update teachers table with new fields
ALTER TABLE public.teachers
ADD COLUMN teacher_id TEXT,
ADD COLUMN level TEXT CHECK (level IN ('PG', 'Primary', 'Secondary')),
ADD COLUMN class_taught TEXT,
ADD COLUMN salary NUMERIC DEFAULT 0;

-- Create salary_payments table for tracking monthly salary payments
CREATE TABLE public.salary_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  month TEXT NOT NULL CHECK (month IN ('Baisakh', 'Jestha', 'Ashar', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra')),
  year INTEGER NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  remarks TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.salary_payments ENABLE ROW LEVEL SECURITY;

-- Policies for salary_payments
CREATE POLICY "Authenticated users can view salary payments"
  ON public.salary_payments
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create salary payments"
  ON public.salary_payments
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

CREATE POLICY "Authenticated users can delete salary payments"
  ON public.salary_payments
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Trigger for updated_at on salary_payments
CREATE TRIGGER update_salary_payments_updated_at
  BEFORE UPDATE ON public.salary_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();