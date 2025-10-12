import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteAllStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DeleteAllStudentsDialog = ({ open, onOpenChange, onSuccess }: DeleteAllStudentsDialogProps) => {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeleteAll = async () => {
    if (!password) {
      toast({
        variant: "destructive",
        title: "Password required",
        description: "Please enter your password to confirm deletion",
      });
      return;
    }

    setLoading(true);

    try {
      // Verify password by attempting to sign in with the current user's email
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email) {
        throw new Error("No user found");
      }

      // Verify password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      });

      if (signInError) {
        toast({
          variant: "destructive",
          title: "Invalid password",
          description: "The password you entered is incorrect",
        });
        setLoading(false);
        return;
      }

      // Delete all students
      const { error: deleteError } = await supabase
        .from("students")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all records

      if (deleteError) throw deleteError;

      toast({
        title: "Success",
        description: "All student records have been deleted",
      });

      setPassword("");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete student records",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete All Students
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete all student records from the database.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> All student data, including fee payments and attendance records, will be permanently removed.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label htmlFor="password">Enter your password to confirm</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your account password"
              className="mt-2"
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAll}
            disabled={loading || !password}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {loading ? "Deleting..." : "Delete All Students"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAllStudentsDialog;
