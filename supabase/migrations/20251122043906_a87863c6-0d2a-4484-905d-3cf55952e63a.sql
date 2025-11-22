-- Add employee_type column to teachers table
ALTER TABLE public.teachers 
ADD COLUMN employee_type text NOT NULL DEFAULT 'Teacher';

-- Add a check constraint to ensure valid values
ALTER TABLE public.teachers
ADD CONSTRAINT teachers_employee_type_check 
CHECK (employee_type IN ('Teacher', 'Staff'));