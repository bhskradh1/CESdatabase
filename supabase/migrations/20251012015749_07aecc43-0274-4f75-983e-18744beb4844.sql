-- Add DELETE policy for fee_payments table
CREATE POLICY "Authenticated users can delete fee payments"
ON public.fee_payments
FOR DELETE
USING (auth.uid() IS NOT NULL);