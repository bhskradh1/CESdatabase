-- Add receipt_number column to fee_payments
ALTER TABLE public.fee_payments 
ADD COLUMN IF NOT EXISTS receipt_number TEXT UNIQUE;

-- Add photo_url to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create function to generate receipt number
CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  -- Get the next receipt number
  SELECT COALESCE(MAX(SUBSTRING(receipt_number FROM 4)::INTEGER), 0) + 1
  INTO next_num
  FROM public.fee_payments
  WHERE receipt_number IS NOT NULL;
  
  -- Generate receipt number in format CES001, CES002, etc.
  NEW.receipt_number := 'CES' || LPAD(next_num::TEXT, 3, '0');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-generate receipt numbers
DROP TRIGGER IF EXISTS set_receipt_number ON public.fee_payments;
CREATE TRIGGER set_receipt_number
  BEFORE INSERT ON public.fee_payments
  FOR EACH ROW
  WHEN (NEW.receipt_number IS NULL)
  EXECUTE FUNCTION public.generate_receipt_number();

-- Create index on receipt_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_fee_payments_receipt_number ON public.fee_payments(receipt_number);