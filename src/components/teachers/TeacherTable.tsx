import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, DollarSign, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import EditTeacherDialog from "./EditTeacherDialog";
import SalaryPaymentDialog from "./SalaryPaymentDialog";
import TeacherDetailsDialog from "./TeacherDetailsDialog";
import type { Database } from "@/integrations/supabase/types";

type Teacher = Database['public']['Tables']['teachers']['Row'];

interface TeacherTableProps {
  teachers: Teacher[];
  onRefetch: () => void;
  userId: string;
}

const TeacherTable = ({ teachers, onRefetch, userId }: TeacherTableProps) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [salaryDialogOpen, setSalaryDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const handleDelete = async () => {
    if (!teacherToDelete) return;

    const { error } = await supabase.from("teachers").delete().eq("id", teacherToDelete);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete teacher",
      });
    } else {
      toast({
        title: "Success",
        description: "Teacher deleted successfully",
      });
      onRefetch();
    }
    setDeleteDialogOpen(false);
    setTeacherToDelete(null);
  };

  const openEditDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setEditDialogOpen(true);
  };

  const openDetailsDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setDetailsDialogOpen(true);
  };

  const openSalaryDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setSalaryDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setTeacherToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Teacher ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No teachers found
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    {teacher.photo_url ? (
                      <img
                        src={teacher.photo_url}
                        alt={teacher.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm">
                        {teacher.name.charAt(0)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{teacher.teacher_id || "-"}</TableCell>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.level || "-"}</TableCell>
                  <TableCell>{teacher.class_taught || "-"}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>Rs. {teacher.salary || 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openDetailsDialog(teacher)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(teacher)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openSalaryDialog(teacher)}>
                        <DollarSign className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteDialog(teacher.id)}
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

      <EditTeacherDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        teacher={selectedTeacher}
        onSuccess={onRefetch}
      />

      <TeacherDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        teacher={selectedTeacher}
      />

      <SalaryPaymentDialog
        open={salaryDialogOpen}
        onOpenChange={setSalaryDialogOpen}
        teacher={selectedTeacher}
        onSuccess={onRefetch}
        userId={userId}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this teacher? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TeacherTable;
