import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AddTeacherDialog from "@/components/teachers/AddTeacherDialog";
import AddStaffDialog from "@/components/staff/AddStaffDialog";
import EditTeacherDialog from "@/components/teachers/EditTeacherDialog";
import EditStaffDialog from "@/components/staff/EditStaffDialog";
import TeacherDetailsDialog from "@/components/teachers/TeacherDetailsDialog";
import StaffDetailsDialog from "@/components/staff/StaffDetailsDialog";
import SalaryPaymentDialog from "@/components/teachers/SalaryPaymentDialog";
import StaffSalaryPaymentDialog from "@/components/staff/StaffSalaryPaymentDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, Edit, Trash2, DollarSign, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Teacher = Database['public']['Tables']['teachers']['Row'];
type Staff = {
  id: string;
  staff_id: string | null;
  name: string;
  address: string | null;
  contact: string;
  salary: number | null;
  photo_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

type Employee = {
  id: string;
  type: 'teacher' | 'staff';
  name: string;
  id_number: string | null;
  contact: string;
  salary: number | null;
  photo_url: string | null;
  level?: string | null;
  subject?: string;
  class_taught?: string | null;
  data: Teacher | Staff;
};

const Employees = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [employeeType, setEmployeeType] = useState<'teacher' | 'staff'>('teacher');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [salaryDialogOpen, setSalaryDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'teacher' | 'staff'>('all');

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

  const { data: teachers = [], refetch: refetchTeachers } = useQuery<Teacher[]>({
    queryKey: ["teachers"],
    queryFn: async (): Promise<Teacher[]> => {
      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Teacher[];
    },
  });

  const { data: staff = [], refetch: refetchStaff } = useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: async (): Promise<Staff[]> => {
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Staff[];
    },
  });

  const refetchAll = () => {
    refetchTeachers();
    refetchStaff();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const openAddDialog = (type: 'teacher' | 'staff') => {
    setEmployeeType(type);
    setAddDialogOpen(true);
  };

  const employees: Employee[] = [
    ...teachers.map(t => ({
      id: t.id,
      type: 'teacher' as const,
      name: t.name,
      id_number: t.teacher_id,
      contact: t.contact,
      salary: t.salary,
      photo_url: t.photo_url,
      level: t.level,
      subject: t.subject,
      class_taught: t.class_taught,
      data: t,
    })),
    ...staff.map(s => ({
      id: s.id,
      type: 'staff' as const,
      name: s.name,
      id_number: s.staff_id,
      contact: s.contact,
      salary: s.salary,
      photo_url: s.photo_url,
      data: s,
    })),
  ];

  const filteredEmployees = employees.filter((emp) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      emp.name.toLowerCase().includes(query) ||
      emp.id_number?.toLowerCase().includes(query) ||
      emp.contact.toLowerCase().includes(query) ||
      (emp.type === 'teacher' && (
        emp.subject?.toLowerCase().includes(query) ||
        emp.level?.toLowerCase().includes(query) ||
        emp.class_taught?.toLowerCase().includes(query)
      ));
    
    const matchesFilter = filterType === 'all' || emp.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditDialogOpen(true);
  };

  const handleViewDetails = (employee: Employee) => {
    if (employee.type === 'teacher') {
      setSelectedEmployee(employee);
      setDetailsDialogOpen(true);
    }
  };

  const handleSalaryPayment = (employee: Employee) => {
    if (employee.type === 'teacher') {
      setSelectedEmployee(employee);
      setSalaryDialogOpen(true);
    }
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedEmployee) return;

    const table = selectedEmployee.type === 'teacher' ? 'teachers' : 'staff';
    const { error } = await supabase.from(table).delete().eq("id", selectedEmployee.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete ${selectedEmployee.type}`,
      });
    } else {
      toast({
        title: "Success",
        description: `${selectedEmployee.type === 'teacher' ? 'Teacher' : 'Staff member'} deleted successfully`,
      });
      refetchAll();
    }
    setDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <DashboardHeader user={user} onSignOut={handleSignOut} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Employee Management</h2>
            <p className="text-muted-foreground">Manage teachers and staff members</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => openAddDialog('teacher')} size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Add Teacher
            </Button>
            <Button onClick={() => openAddDialog('staff')} size="lg" variant="secondary">
              <Plus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, contact, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              <SelectItem value="teacher">Teachers Only</SelectItem>
              <SelectItem value="staff">Staff Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No employees found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={`${employee.type}-${employee.id}`}>
                    <TableCell>
                      {employee.photo_url ? (
                        <img
                          src={employee.photo_url}
                          alt={employee.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm">
                          {employee.name.charAt(0)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        employee.type === 'teacher' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-secondary/10 text-secondary'
                      }`}>
                        {employee.type === 'teacher' ? 'Teacher' : 'Staff'}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{employee.id_number || "-"}</TableCell>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.contact}</TableCell>
                    <TableCell>
                      {employee.type === 'teacher' ? (
                        <div className="text-sm">
                          <div>{employee.subject}</div>
                          <div className="text-muted-foreground">{employee.level} | {employee.class_taught || '-'}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>Rs. {employee.salary || 0}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewDetails(employee)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(employee)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSalaryPayment(employee)}>
                          <DollarSign className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(employee)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {employeeType === 'teacher' ? (
          <AddTeacherDialog
            open={addDialogOpen && employeeType === 'teacher'}
            onOpenChange={setAddDialogOpen}
            onSuccess={refetchAll}
            userId={user?.id || ""}
          />
        ) : (
          <AddStaffDialog
            open={addDialogOpen && employeeType === 'staff'}
            onOpenChange={setAddDialogOpen}
            onSuccess={refetchAll}
            userId={user?.id || ""}
          />
        )}

        {selectedEmployee?.type === 'teacher' ? (
          <>
            <EditTeacherDialog
              open={editDialogOpen && selectedEmployee?.type === 'teacher'}
              onOpenChange={setEditDialogOpen}
              teacher={selectedEmployee?.data as Teacher}
              onSuccess={refetchAll}
            />
            <TeacherDetailsDialog
              open={detailsDialogOpen && selectedEmployee?.type === 'teacher'}
              onOpenChange={setDetailsDialogOpen}
              teacher={selectedEmployee?.data as Teacher}
            />
            <SalaryPaymentDialog
              open={salaryDialogOpen && selectedEmployee?.type === 'teacher'}
              onOpenChange={setSalaryDialogOpen}
              teacher={selectedEmployee?.data as Teacher}
              onSuccess={refetchAll}
              userId={user?.id || ""}
            />
          </>
        ) : selectedEmployee?.type === 'staff' ? (
          <>
            <EditStaffDialog
              open={editDialogOpen && selectedEmployee?.type === 'staff'}
              onOpenChange={setEditDialogOpen}
              staff={selectedEmployee?.data as Staff}
              onSuccess={refetchAll}
            />
            <StaffDetailsDialog
              open={detailsDialogOpen && selectedEmployee?.type === 'staff'}
              onOpenChange={setDetailsDialogOpen}
              staff={selectedEmployee?.data as Staff}
            />
            <StaffSalaryPaymentDialog
              open={salaryDialogOpen && selectedEmployee?.type === 'staff'}
              onOpenChange={setSalaryDialogOpen}
              staff={selectedEmployee?.data as Staff}
              onSuccess={refetchAll}
              userId={user?.id || ""}
            />
          </>
        ) : null}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {selectedEmployee?.type === 'teacher' ? 'Teacher' : 'Staff Member'}</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedEmployee?.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Employees;
