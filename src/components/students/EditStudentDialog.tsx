import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { studentFormSchema } from "@/lib/validation";
import { Upload, X, Image as ImageIcon } from "lucide-react";

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
  remarks: string | null;
}

interface EditStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onSuccess: () => void;
}

const EditStudentDialog = ({ open, onOpenChange, student, onSuccess }: EditStudentDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [formData, setFormData] = useState({
    student_id: "",
    name: "",
    roll_number: "",
    class: "",
    section: "",
    contact: "",
    address: "",
    total_fee: "",
    photo_url: "",
    remarks: "",
  });

  useEffect(() => {
    if (student) {
      setFormData({
        student_id: student.student_id,
        name: student.name,
        roll_number: student.roll_number,
        class: student.class,
        section: student.section || "",
        contact: student.contact || "",
        address: student.address || "",
        total_fee: student.total_fee.toString(),
        photo_url: (student as any).photo_url || "",
        remarks: student.remarks || "",
      });
      setPhotoPreview((student as any).photo_url || "");
    }
  }, [student]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file",
          description: "Please select an image file",
        });
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return formData.photo_url || null;

    setUploading(true);
    try {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('student-photos')
        .upload(filePath, photoFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('student-photos')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");
    setFormData({ ...formData, photo_url: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setLoading(true);

    try {
      // Upload photo if selected
      const photoUrl = await uploadPhoto();

      // Validate input
      const validationResult = studentFormSchema.safeParse({
        student_id: formData.student_id,
        name: formData.name,
        roll_number: formData.roll_number,
        class: formData.class,
        section: formData.section || undefined,
        contact: formData.contact || undefined,
        address: formData.address || undefined,
        total_fee: parseFloat(formData.total_fee) || 0,
        photo_url: photoUrl || undefined,
        remarks: formData.remarks || undefined,
      });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: firstError.message,
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("students")
      .update({
        student_id: formData.student_id,
        name: formData.name,
        roll_number: formData.roll_number,
        class: formData.class,
        section: formData.section || null,
        contact: formData.contact || null,
        address: formData.address || null,
        total_fee: parseFloat(formData.total_fee) || 0,
        photo_url: photoUrl || null,
        remarks: formData.remarks || null,
      })
      .eq("id", student.id);

    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update student",
      });
    } else {
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
      onOpenChange(false);
      onSuccess();
    }
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message,
    });
    setLoading(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student_id">Student ID</Label>
              <Input
                id="student_id"
                value={formData.student_id}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roll_number">Roll Number</Label>
              <Input
                id="roll_number"
                value={formData.roll_number}
                onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Input
                id="class"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_fee">Total Fee</Label>
              <Input
                id="total_fee"
                type="number"
                value={formData.total_fee}
                onChange={(e) => setFormData({ ...formData, total_fee: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Student Photo</Label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload from gallery (JPG, PNG, WEBP)
                </p>
              </div>
              {(photoPreview || formData.photo_url) && (
                <div className="relative w-20 h-20 rounded border">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded" />
                  ) : formData.photo_url ? (
                    <img src={formData.photo_url} alt="Preview" className="w-full h-full object-cover rounded" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={clearPhoto}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {uploading ? "Uploading..." : loading ? "Updating..." : "Update Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentDialog;
