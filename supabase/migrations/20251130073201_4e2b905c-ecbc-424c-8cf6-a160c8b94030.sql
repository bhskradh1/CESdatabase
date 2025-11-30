-- Create staff_salary_payments table
CREATE TABLE public.staff_salary_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  remarks TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.staff_salary_payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all staff salary payments"
  ON public.staff_salary_payments
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create staff salary payments"
  ON public.staff_salary_payments
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() = created_by);

CREATE POLICY "Admins can delete staff salary payments"
  ON public.staff_salary_payments
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));