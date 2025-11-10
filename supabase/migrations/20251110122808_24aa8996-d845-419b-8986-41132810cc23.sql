-- Fix search_path for existing functions to prevent security vulnerabilities

-- Update calculate_fee_due function
CREATE OR REPLACE FUNCTION public.calculate_fee_due(student_uuid uuid)
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT COALESCE(s.total_fee, 0) - COALESCE(s.fee_paid, 0)
  FROM public.students s
  WHERE s.id = student_uuid;
$function$;

-- Update get_user_role function (keeping for backward compatibility)
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$function$;

-- Update calculate_total_due function
CREATE OR REPLACE FUNCTION public.calculate_total_due(
  p_previous_year_balance numeric, 
  p_current_year_fees numeric, 
  p_fee_paid_current_year numeric
)
RETURNS numeric
LANGUAGE sql
STABLE STRICT
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT (COALESCE(p_current_year_fees, 0) + COALESCE(p_previous_year_balance, 0) - COALESCE(p_fee_paid_current_year, 0));
$function$;