import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, GraduationCap, Phone, MapPin, IndianRupee, Calendar, FileText } from "lucide-react";

interface Student {
  id: string;
  student_id: string;
  name: string;
  roll_number: string;
  class: string;
  section: string | null;
  contact: string | null;
  address: string | null;
  total_fee: number;
  fee_paid: number;
  fee_paid_current_year?: number;
  previous_year_balance?: number;
  attendance_percentage: number;
  remarks: string | null;
  photo_url?: string | null;
  created_at?: string;
}

interface StudentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

const StudentDetailsDialog = ({ open, onOpenChange, student }: StudentDetailsDialogProps) => {
  if (!student) return null;
  
  // Calculate fees using the new separated fields
  const paidThisYear = student.fee_paid_current_year ?? student.fee_paid ?? 0;
  const prevBal = student.previous_year_balance ?? 0;
  const feeDue = (student.total_fee + prevBal) - paidThisYear;
  const initials = student.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Header with Photo */}
          <div className="flex items-start gap-4">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={student.photo_url || undefined} alt={student.name} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{student.name}</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline" className="gap-1">
                  <User className="h-3 w-3" />
                  ID: {student.student_id}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <GraduationCap className="h-3 w-3" />
                  Roll: {student.roll_number}
                </Badge>
                <Badge className="gap-1">
                  Class: {student.class} {student.section && `- ${student.section}`}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <p className="font-medium">{student.contact || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="font-medium flex items-start gap-2">
                  {student.address ? (
                    <>
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span>{student.address}</span>
                    </>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Fee Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              Fee Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Total Payable</p>
                <p className="text-lg font-bold">₹{(student.total_fee + prevBal).toLocaleString()}</p>
                {prevBal !== 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    (₹{student.total_fee.toLocaleString()} {prevBal > 0 ? '+' : ''} ₹{Math.abs(prevBal).toLocaleString()})
                  </p>
                )}
              </div>
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Fee Paid</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  ₹{paidThisYear.toLocaleString()}
                </p>
              </div>
              <div className={`${feeDue > 0 ? 'bg-red-50 dark:bg-red-950' : 'bg-green-50 dark:bg-green-950'} p-3 rounded-lg`}>
                <p className="text-xs text-muted-foreground mb-1">Fee Due</p>
                <p className={`text-lg font-bold ${feeDue > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  ₹{feeDue.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Attendance</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {student.attendance_percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Remarks */}
          {student.remarks && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Remarks
                </h3>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">{student.remarks}</p>
              </div>
            </>
          )}

          {/* Additional Info */}
          {student.created_at && (
            <>
              <Separator />
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                Created on: {new Date(student.created_at).toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsDialog;
