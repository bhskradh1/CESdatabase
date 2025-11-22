-- Remove the employee_type column from teachers table
ALTER TABLE public.teachers 
DROP COLUMN IF EXISTS employee_type;

-- Remove the check constraint
ALTER TABLE public.teachers
DROP CONSTRAINT IF EXISTS teachers_employee_type_check;

-- Create staff table
CREATE TABLE public.staff (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id text,
  name text NOT NULL,
  address text,
  contact text NOT NULL,
  salary numeric DEFAULT 0,
  photo_url text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for staff
CREATE POLICY "Admins can view all staff"
ON public.staff FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create staff"
ON public.staff FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() = created_by);

CREATE POLICY "Admins can update staff"
ON public.staff FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete staff"
ON public.staff FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_staff_updated_at
BEFORE UPDATE ON public.staff
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();