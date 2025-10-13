import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SalaryPaymentHistory from "./SalaryPaymentHistory";
import type { Database } from "@/integrations/supabase/types";

type Teacher = Database['public']['Tables']['teachers']['Row'];

interface TeacherDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher | null;
}

const TeacherDetailsDialog = ({ open, onOpenChange, teacher }: TeacherDetailsDialogProps) => {
  if (!teacher) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Teacher Details</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="payments">Salary Payments</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-6">
            {teacher.photo_url && (
              <div className="flex justify-center">
                <img
                  src={teacher.photo_url}
                  alt={teacher.name}
                  className="h-32 w-32 rounded-full object-cover border-4 border-primary/20"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Teacher ID</p>
                <p className="font-medium">{teacher.teacher_id || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{teacher.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="font-medium">{teacher.level || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class Taught</p>
                <p className="font-medium">{teacher.class_taught || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subject</p>
                <p className="font-medium">{teacher.subject}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Qualification</p>
                <p className="font-medium">{teacher.qualification}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-medium">{teacher.experience} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Salary</p>
                <p className="font-medium">Rs. {teacher.salary || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{teacher.contact}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{teacher.email}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="payments">
            <SalaryPaymentHistory teacherId={teacher.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherDetailsDialog;
