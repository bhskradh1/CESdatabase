import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface StaffSalaryPaymentHistoryProps {
  staffId: string;
}

interface SalaryPayment {
  id: string;
  amount: number;
  month: string;
  year: number;
  payment_date: string;
  payment_method: string | null;
  remarks: string | null;
  created_at: string;
}

const StaffSalaryPaymentHistory = ({ staffId }: StaffSalaryPaymentHistoryProps) => {
  const { data: payments = [], isLoading } = useQuery<SalaryPayment[]>({
    queryKey: ["staff-salary-payments", staffId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff_salary_payments")
        .select("*")
        .eq("staff_id", staffId)
        .order("year", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SalaryPayment[];
    },
  });

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading payment history...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-primary/10 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">Total Paid</p>
        <p className="text-2xl font-bold">Rs. {totalPaid.toLocaleString()}</p>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No salary payments recorded yet
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month/Year</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.month} {payment.year}
                  </TableCell>
                  <TableCell>Rs. {payment.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    {new Date(payment.payment_date).toLocaleDateString('en-IN')}
                  </TableCell>
                  <TableCell>
                    {payment.payment_method ? (
                      <Badge variant="outline" className="capitalize">
                        {payment.payment_method.replace('_', ' ')}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {payment.remarks || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default StaffSalaryPaymentHistory;
