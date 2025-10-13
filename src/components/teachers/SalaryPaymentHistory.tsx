import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type SalaryPayment = Database['public']['Tables']['salary_payments']['Row'];

interface SalaryPaymentHistoryProps {
  teacherId: string;
}

const SalaryPaymentHistory = ({ teacherId }: SalaryPaymentHistoryProps) => {
  const { data: payments = [] } = useQuery<SalaryPayment[]>({
    queryKey: ["salary_payments", teacherId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salary_payments")
        .select("*")
        .eq("teacher_id", teacherId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SalaryPayment[];
    },
  });

  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No salary payments recorded yet
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Date</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.month}</TableCell>
              <TableCell>{payment.year}</TableCell>
              <TableCell>Rs. {payment.amount}</TableCell>
              <TableCell>{format(new Date(payment.payment_date), "PPP")}</TableCell>
              <TableCell>{payment.payment_method || "-"}</TableCell>
              <TableCell>{payment.remarks || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SalaryPaymentHistory;
