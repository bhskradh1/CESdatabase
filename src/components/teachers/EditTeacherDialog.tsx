import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { teacherFormSchema } from "@/lib/validation";
import { X, Image as ImageIcon } from "lucide-react";

type Teacher = Database['public']['Tables']['teachers']['Row'];

interface EditTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher | null;
  onSuccess: () => void;
}

const EditTeacherDialog = ({ open, onOpenChange, teacher, onSuccess }: EditTeacherDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [formData, setFormData] = useState({
    teacher_id: "",
    name: "",
    subject: "",
    contact: "",
    email: "",
    qualification: "",
    experience: "",
    level: "",
    class_taught: "",
    salary: "",
    photo_url: "",
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        teacher_id: teacher.teacher_id || "",
        name: teacher.name,
        subject: teacher.subject,
        contact: teacher.contact,
        email: teacher.email,
        qualification: teacher.qualification,
        experience: teacher.experience.toString(),
        level: teacher.level || "",
        class_taught: teacher.class_taught || "",
        salary: teacher.salary?.toString() || "0",
        photo_url: teacher.photo_url || "",
      });
      setPhotoPreview(teacher.photo_url || "");
    }
  }, [teacher]);

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
        .from('teacher-photos')
        .upload(filePath, photoFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('teacher-photos')
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
    if (!teacher) return;

    setLoading(true);

    try {
      // Upload photo if selected
      const photoUrl = await uploadPhoto();

      // Validate input
      const validationResult = teacherFormSchema.safeParse({
        teacher_id: formData.teacher_id,
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        subject: formData.subject,
        qualification: formData.qualification,
        experience: parseInt(formData.experience) || 0,
        level: formData.level,
        class_taught: formData.class_taught || undefined,
        salary: parseFloat(formData.salary) || 0,
        photo_url: photoUrl || undefined,
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
      .from("teachers")
      .update({
        teacher_id: formData.teacher_id,
        name: formData.name,
        subject: formData.subject,
        contact: formData.contact,
        email: formData.email,
        qualification: formData.qualification,
        experience: parseInt(formData.experience) || 0,
        level: formData.level,
        class_taught: formData.class_taught || null,
        salary: parseFloat(formData.salary) || 0,
        photo_url: photoUrl || null,
      })
      .eq("id", teacher.id);

    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update teacher",
      });
    } else {
      toast({
        title: "Success",
        description: "Teacher updated successfully",
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
          <DialogTitle>Edit Teacher</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teacher_id">Teacher ID</Label>
              <Input
                id="teacher_id"
                value={formData.teacher_id}
                onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
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
              <Label htmlFor="level">Level</Label>
              <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PG">PG</SelectItem>
                  <SelectItem value="Primary">Primary</SelectItem>
                  <SelectItem value="Secondary">Secondary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class_taught">Class Taught</Label>
              <Input
                id="class_taught"
                value={formData.class_taught}
                onChange={(e) => setFormData({ ...formData, class_taught: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience (years)</Label>
              <Input
                id="experience"
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="photo">Teacher Photo</Label>
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
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {uploading ? "Uploading..." : loading ? "Updating..." : "Update Teacher"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeacherDialog;
