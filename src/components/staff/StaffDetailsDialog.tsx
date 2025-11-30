import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StaffSalaryPaymentHistory from "./StaffSalaryPaymentHistory";

interface Staff {
  id: string;
  staff_id: string | null;
  name: string;
  address: string | null;
  contact: string;
  salary: number | null;
  photo_url: string | null;
  created_at: string;
}

interface StaffDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff | null;
}

const StaffDetailsDialog = ({ open, onOpenChange, staff }: StaffDetailsDialogProps) => {
  if (!staff) return null;

  const initials = staff.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Staff Details</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="payments">Salary Payments</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-6">
            <div className="flex justify-center">
              <Avatar className="h-32 w-32 border-4 border-primary/20">
                <AvatarImage src={staff.photo_url || undefined} alt={staff.name} />
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Staff ID</p>
                <p className="font-medium">{staff.staff_id || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{staff.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Salary</p>
                <p className="font-medium">Rs. {staff.salary?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{staff.contact}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{staff.address || "-"}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="payments">
            <StaffSalaryPaymentHistory staffId={staff.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDetailsDialog;
