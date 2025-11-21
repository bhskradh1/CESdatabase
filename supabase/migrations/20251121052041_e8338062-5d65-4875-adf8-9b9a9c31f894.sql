-- Create storage buckets for student and teacher photos
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('student-photos', 'student-photos', true),
  ('teacher-photos', 'teacher-photos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for student photos
CREATE POLICY "Admins can upload student photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'student-photos' AND
  (SELECT has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Admins can update student photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'student-photos' AND
  (SELECT has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Admins can delete student photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'student-photos' AND
  (SELECT has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Everyone can view student photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'student-photos');

-- RLS policies for teacher photos
CREATE POLICY "Admins can upload teacher photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'teacher-photos' AND
  (SELECT has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Admins can update teacher photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'teacher-photos' AND
  (SELECT has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Admins can delete teacher photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'teacher-photos' AND
  (SELECT has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Everyone can view teacher photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'teacher-photos');