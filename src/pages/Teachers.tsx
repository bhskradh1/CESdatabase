import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Teacher {
  id: string;
  name: string;
  subject: string;
  contact: string;
  email: string;
  qualification: string;
  experience: number;
  photo_url?: string;
  created_at: string;
}

export default function Teachers() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchTeachers();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
    }
  };

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('name');

      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading teachers...</div>
        ) : teachers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No teachers found. Add your first teacher to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {teacher.photo_url && (
                      <img
                        src={teacher.photo_url}
                        alt={teacher.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    )}
                    <span>{teacher.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Subject:</span> {teacher.subject}</p>
                    <p><span className="font-medium">Contact:</span> {teacher.contact}</p>
                    <p><span className="font-medium">Email:</span> {teacher.email}</p>
                    <p><span className="font-medium">Qualification:</span> {teacher.qualification}</p>
                    <p><span className="font-medium">Experience:</span> {teacher.experience} years</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
