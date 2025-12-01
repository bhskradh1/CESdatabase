import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const NEPALI_MONTHS = [
  "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

const SalaryReports = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const currentNepaliYear = 2082;
  const [selectedYear, setSelectedYear] = useState(currentNepaliYear.toString());
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [employeeType, setEmployeeType] = useState<"all" | "teacher" | "staff">("all");
  const [customYear, setCustomYear] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: teacherPayments = [], isLoading: loadingTeachers } = useQuery({
    queryKey: ["teacher-salary-reports", selectedYear, selectedMonth],
    queryFn: async () => {
      let query = supabase
        .from("salary_payments")
        .select(`
          *,
          teachers (name, teacher_id, subject)
        `)
        .eq("year", parseInt(selectedYear))
        .order("created_at", { ascending: false });

      if (selectedMonth !== "all") {
        query = query.eq("month", selectedMonth);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: employeeType === "all" || employeeType === "teacher",
  });

  const { data: staffPayments = [], isLoading: loadingStaff } = useQuery({
    queryKey: ["staff-salary-reports", selectedYear, selectedMonth],
    queryFn: async () => {
      let query = supabase
        .from("staff_salary_payments")
        .select(`
          *,
          staff (name, staff_id, contact)
        `)
        .eq("year", parseInt(selectedYear))
        .order("created_at", { ascending: false });

      if (selectedMonth !== "all") {
        query = query.eq("month", selectedMonth);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: employeeType === "all" || employeeType === "staff",
  });

  const handleAddCustomYear = () => {
    if (customYear && !isNaN(parseInt(customYear))) {
      setSelectedYear(customYear);
      setCustomYear("");
    }
  };

  const totalTeacherSalary = teacherPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const totalStaffSalary = staffPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const grandTotal = totalTeacherSalary + totalStaffSalary;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const isLoading = loadingTeachers || loadingStaff;

  // Generate year options (last 5 years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentNepaliYear + i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <DashboardHeader user={user} onSignOut={handleSignOut} />
      
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Salary Reports</h1>
        </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Employee Type</Label>
              <Select value={employeeType} onValueChange={(value: any) => setEmployeeType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  <SelectItem value="teacher">Teachers Only</SelectItem>
                  <SelectItem value="staff">Staff Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Year (BS)</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Add Custom Year</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="e.g., 2082"
                  value={customYear}
                  onChange={(e) => setCustomYear(e.target.value)}
                />
                <Button onClick={handleAddCustomYear} variant="outline">
                  Set
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {NEPALI_MONTHS.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Teacher Salaries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              Rs. {totalTeacherSalary.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {teacherPayments.length} payment{teacherPayments.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Staff Salaries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              Rs. {totalStaffSalary.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {staffPayments.length} payment{staffPayments.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Grand Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              Rs. {grandTotal.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {teacherPayments.length + staffPayments.length} total payment{teacherPayments.length + staffPayments.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Teacher Payments Table */}
      {(employeeType === "all" || employeeType === "teacher") && (
        <Card>
          <CardHeader>
            <CardTitle>Teacher Salary Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : teacherPayments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No teacher salary payments found for the selected period
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherPayments.map((payment: any) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {payment.teachers?.name || "N/A"}
                        </TableCell>
                        <TableCell>{payment.teachers?.teacher_id || "N/A"}</TableCell>
                        <TableCell>{payment.teachers?.subject || "N/A"}</TableCell>
                        <TableCell>{payment.month}</TableCell>
                        <TableCell>{payment.year}</TableCell>
                        <TableCell className="font-semibold">
                          Rs. {payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {new Date(payment.payment_date).toLocaleDateString("en-IN")}
                        </TableCell>
                        <TableCell>
                          {payment.payment_method ? (
                            <Badge variant="outline" className="capitalize">
                              {payment.payment_method.replace("_", " ")}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Staff Payments Table */}
      {(employeeType === "all" || employeeType === "staff") && (
        <Card>
          <CardHeader>
            <CardTitle>Staff Salary Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : staffPayments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No staff salary payments found for the selected period
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffPayments.map((payment: any) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {payment.staff?.name || "N/A"}
                        </TableCell>
                        <TableCell>{payment.staff?.staff_id || "N/A"}</TableCell>
                        <TableCell>{payment.staff?.contact || "N/A"}</TableCell>
                        <TableCell>{payment.month}</TableCell>
                        <TableCell>{payment.year}</TableCell>
                        <TableCell className="font-semibold">
                          Rs. {payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {new Date(payment.payment_date).toLocaleDateString("en-IN")}
                        </TableCell>
                        <TableCell>
                          {payment.payment_method ? (
                            <Badge variant="outline" className="capitalize">
                              {payment.payment_method.replace("_", " ")}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
};

export default SalaryReports;
