-- Secure students table - restrict access to admins only
DROP POLICY IF EXISTS "Authenticated users can view students" ON public.students;
DROP POLICY IF EXISTS "Authenticated users can update students" ON public.students;
DROP POLICY IF EXISTS "Authenticated users can delete students" ON public.students;
DROP POLICY IF EXISTS "Authenticated users can create students" ON public.students;

-- Create admin-only policies for students table
CREATE POLICY "Admins can view all students"
ON public.students
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create students"
ON public.students
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin') AND auth.uid() = created_by);

CREATE POLICY "Admins can update students"
ON public.students
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete students"
ON public.students
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Secure attendance_records table - restrict to admins only
DROP POLICY IF EXISTS "Authenticated users can view attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Authenticated users can update attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Authenticated users can create attendance" ON public.attendance_records;

CREATE POLICY "Admins can view all attendance"
ON public.attendance_records
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create attendance"
ON public.attendance_records
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin') AND auth.uid() = created_by);

CREATE POLICY "Admins can update attendance"
ON public.attendance_records
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Secure fee_payments table - restrict to admins only
DROP POLICY IF EXISTS "Authenticated users can view fee payments" ON public.fee_payments;
DROP POLICY IF EXISTS "Authenticated users can delete fee payments" ON public.fee_payments;
DROP POLICY IF EXISTS "Authenticated users can create fee payments" ON public.fee_payments;

CREATE POLICY "Admins can view all fee payments"
ON public.fee_payments
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create fee payments"
ON public.fee_payments
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin') AND auth.uid() = created_by);

CREATE POLICY "Admins can delete fee payments"
ON public.fee_payments
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Secure salary_payments table - restrict to admins only
DROP POLICY IF EXISTS "Authenticated users can view salary payments" ON public.salary_payments;
DROP POLICY IF EXISTS "Authenticated users can delete salary payments" ON public.salary_payments;
DROP POLICY IF EXISTS "Authenticated users can create salary payments" ON public.salary_payments;

CREATE POLICY "Admins can view all salary payments"
ON public.salary_payments
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create salary payments"
ON public.salary_payments
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin') AND auth.uid() = created_by);

CREATE POLICY "Admins can delete salary payments"
ON public.salary_payments
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));