import { supabase } from '@/integrations/supabase/client';
import { offlineDb, Student, FeePayment, AttendanceRecord, Teacher, Staff, SalaryPayment, StaffSalaryPayment } from './offline-db';
import { syncService } from './sync-service';

export interface DataServiceConfig {
  useOffline: boolean;
  autoSync: boolean;
}

class DataService {
  private config: DataServiceConfig = {
    useOffline: true,
    autoSync: true
  };

  constructor() {
    this.config.useOffline = !navigator.onLine;
  }

  // Student operations
  async getStudents(): Promise<Student[]> {
    if (this.config.useOffline || !navigator.onLine) {
      return await offlineDb.students.orderBy('created_at').toArray();
    }

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch students online, falling back to offline:', error);
      return await offlineDb.students.orderBy('created_at').toArray();
    }
  }

  async createStudent(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> {
    const newStudent: Student = {
      ...student,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      _offline_created: true,
      _sync_pending: 1,
      _last_sync: new Date().toISOString()
    };

    await offlineDb.students.add(newStudent);

    if (navigator.onLine && this.config.autoSync) {
      try {
        const { error } = await supabase
          .from('students')
          .insert({
            id: newStudent.id,
            student_id: newStudent.student_id,
            name: newStudent.name,
            roll_number: newStudent.roll_number,
            class: newStudent.class,
            section: newStudent.section,
            contact: newStudent.contact,
            address: newStudent.address,
            total_fee: newStudent.total_fee,
            fee_paid: newStudent.fee_paid,
            fee_paid_current_year: newStudent.fee_paid_current_year,
            previous_year_balance: newStudent.previous_year_balance,
            attendance_percentage: newStudent.attendance_percentage,
            remarks: newStudent.remarks,
            photo_url: newStudent.photo_url,
            created_by: newStudent.created_by
          });

        if (error) throw error;
        await offlineDb.markAsSynced('students', newStudent.id);
        return { ...newStudent, _sync_pending: 0 };
      } catch (error) {
        console.error('Failed to sync student creation:', error);
      }
    }

    return newStudent;
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    await offlineDb.students.update(id, {
      ...updates,
      updated_at: new Date().toISOString(),
      _offline_updated: true,
      _sync_pending: 1,
      _last_sync: new Date().toISOString()
    });

    const updatedStudent = await offlineDb.students.get(id);

    if (navigator.onLine && this.config.autoSync && updatedStudent) {
      try {
        const { error } = await supabase
          .from('students')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

        if (error) throw error;
        await offlineDb.markAsSynced('students', id);
        return { ...updatedStudent, _sync_pending: 0 };
      } catch (error) {
        console.error('Failed to sync student update:', error);
      }
    }

    return updatedStudent as Student;
  }

  async deleteStudent(id: string): Promise<void> {
    await offlineDb.students.update(id, {
      _offline_deleted: true,
      _sync_pending: 1,
      _last_sync: new Date().toISOString()
    });

    if (navigator.onLine && this.config.autoSync) {
      try {
        const { error } = await supabase
          .from('students')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await offlineDb.students.delete(id);
      } catch (error) {
        console.error('Failed to sync student deletion:', error);
      }
    }
  }

  // Teacher operations
  async getTeachers(): Promise<Teacher[]> {
    if (this.config.useOffline || !navigator.onLine) {
      return await offlineDb.teachers.orderBy('created_at').toArray();
    }

    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch teachers online, falling back to offline:', error);
      return await offlineDb.teachers.orderBy('created_at').toArray();
    }
  }

  // Staff operations
  async getStaff(): Promise<Staff[]> {
    if (this.config.useOffline || !navigator.onLine) {
      return await offlineDb.staff.orderBy('created_at').toArray();
    }

    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch staff online, falling back to offline:', error);
      return await offlineDb.staff.orderBy('created_at').toArray();
    }
  }

  // Salary Payment operations
  async getSalaryPayments(teacherId?: string): Promise<SalaryPayment[]> {
    if (this.config.useOffline || !navigator.onLine) {
      if (teacherId) {
        return await offlineDb.salaryPayments
          .where('teacher_id')
          .equals(teacherId)
          .toArray();
      }
      return await offlineDb.salaryPayments.toArray();
    }

    try {
      let query = supabase.from('salary_payments').select('*');
      if (teacherId) {
        query = query.eq('teacher_id', teacherId);
      }
      const { data, error } = await query.order('payment_date', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch salary payments online, falling back to offline:', error);
      if (teacherId) {
        return await offlineDb.salaryPayments
          .where('teacher_id')
          .equals(teacherId)
          .toArray();
      }
      return await offlineDb.salaryPayments.toArray();
    }
  }

  // Staff Salary Payment operations
  async getStaffSalaryPayments(staffId?: string): Promise<StaffSalaryPayment[]> {
    if (this.config.useOffline || !navigator.onLine) {
      if (staffId) {
        return await offlineDb.staffSalaryPayments
          .where('staff_id')
          .equals(staffId)
          .toArray();
      }
      return await offlineDb.staffSalaryPayments.toArray();
    }

    try {
      let query = supabase.from('staff_salary_payments').select('*');
      if (staffId) {
        query = query.eq('staff_id', staffId);
      }
      const { data, error } = await query.order('payment_date', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch staff salary payments online, falling back to offline:', error);
      if (staffId) {
        return await offlineDb.staffSalaryPayments
          .where('staff_id')
          .equals(staffId)
          .toArray();
      }
      return await offlineDb.staffSalaryPayments.toArray();
    }
  }

  // Fee Payment operations
  async getFeePayments(studentId?: string): Promise<FeePayment[]> {
    if (this.config.useOffline || !navigator.onLine) {
      if (studentId) {
        return await offlineDb.feePayments
          .where('student_id')
          .equals(studentId)
          .toArray();
      }
      return await offlineDb.feePayments.toArray();
    }

    try {
      let query = supabase.from('fee_payments').select('*');
      
      if (studentId) {
        query = query.eq('student_id', studentId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch payments online, falling back to offline:', error);
      if (studentId) {
        return await offlineDb.feePayments
          .where('student_id')
          .equals(studentId)
          .toArray();
      }
      return await offlineDb.feePayments.toArray();
    }
  }

  async createFeePayment(payment: Omit<FeePayment, 'id' | 'created_at'>): Promise<FeePayment> {
    const newPayment: FeePayment = {
      ...payment,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      _offline_created: true,
      _sync_pending: 1,
      _last_sync: new Date().toISOString()
    };

    await offlineDb.feePayments.add(newPayment);

    if (navigator.onLine && this.config.autoSync) {
      try {
        const { error } = await supabase
          .from('fee_payments')
          .insert({
            id: newPayment.id,
            student_id: newPayment.student_id,
            amount: newPayment.amount,
            payment_date: newPayment.payment_date,
            payment_method: newPayment.payment_method,
            receipt_number: newPayment.receipt_number,
            remarks: newPayment.remarks,
            created_by: newPayment.created_by
          });

        if (error) throw error;
        await offlineDb.markAsSynced('feePayments', newPayment.id);
        return { ...newPayment, _sync_pending: 0 };
      } catch (error) {
        console.error('Failed to sync payment creation:', error);
      }
    }

    return newPayment;
  }

  // Attendance operations
  async getAttendanceRecords(studentId?: string, date?: string): Promise<AttendanceRecord[]> {
    if (this.config.useOffline || !navigator.onLine) {
      if (studentId) {
        return await offlineDb.attendanceRecords
          .where('student_id')
          .equals(studentId)
          .toArray();
      }
      
      return await offlineDb.attendanceRecords.toArray();
    }

    try {
      let query = supabase.from('attendance_records').select('*');
      
      if (studentId) {
        query = query.eq('student_id', studentId);
      }
      
      if (date) {
        query = query.eq('date', date);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch attendance online, falling back to offline:', error);
      let results = await offlineDb.attendanceRecords.toArray();
      
      if (studentId) {
        results = results.filter(r => r.student_id === studentId);
      }
      
      return results;
    }
  }

  async createAttendanceRecord(record: Omit<AttendanceRecord, 'id' | 'created_at'>): Promise<AttendanceRecord> {
    const newRecord: AttendanceRecord = {
      ...record,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      _offline_created: true,
      _sync_pending: 1,
      _last_sync: new Date().toISOString()
    };

    await offlineDb.attendanceRecords.add(newRecord);

    if (navigator.onLine && this.config.autoSync) {
      try {
        const { error } = await supabase
          .from('attendance_records')
          .insert({
            id: newRecord.id,
            student_id: newRecord.student_id,
            date: newRecord.date,
            status: newRecord.status,
            remarks: newRecord.remarks,
            created_by: newRecord.created_by
          });

        if (error) throw error;
        await offlineDb.markAsSynced('attendanceRecords', newRecord.id);
        return { ...newRecord, _sync_pending: 0 };
      } catch (error) {
        console.error('Failed to sync attendance creation:', error);
      }
    }

    return newRecord;
  }

  // Sync operations
  async syncAllData() {
    if (navigator.onLine) {
      await syncService.syncAllData();
    }
  }

  async downloadAllData() {
    if (navigator.onLine) {
      await syncService.syncAllData();
    }
  }

  // Configuration
  setConfig(config: Partial<DataServiceConfig>) {
    this.config = { ...this.config, ...config };
  }

  getConfig(): DataServiceConfig {
    return { ...this.config };
  }
}

export const dataService = new DataService();
