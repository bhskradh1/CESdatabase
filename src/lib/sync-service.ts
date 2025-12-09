import { supabase } from '@/integrations/supabase/client';
import { offlineDb, Student, FeePayment, AttendanceRecord, Teacher, Staff, SalaryPayment, StaffSalaryPayment } from './offline-db';

export interface SyncStatus {
  isOnline: boolean;
  lastSync: string | null;
  pendingChanges: number;
  isSyncing: boolean;
}

class SyncService {
  private isOnline = navigator.onLine;
  private syncInProgress = false;
  private syncListeners: ((status: SyncStatus) => void)[] = [];

  constructor() {
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    if (this.isOnline) {
      this.startPeriodicSync();
    }
  }

  private handleOnline() {
    this.isOnline = true;
    this.startPeriodicSync();
    this.syncAllData();
    this.notifyListeners();
  }

  private handleOffline() {
    this.isOnline = false;
    this.notifyListeners();
  }

  private startPeriodicSync() {
    setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.syncAllData();
      }
    }, 30000);
  }

  public addSyncListener(listener: (status: SyncStatus) => void) {
    this.syncListeners.push(listener);
    return () => {
      const index = this.syncListeners.indexOf(listener);
      if (index > -1) this.syncListeners.splice(index, 1);
    };
  }

  private notifyListeners() {
    const status: SyncStatus = {
      isOnline: this.isOnline,
      lastSync: localStorage.getItem('lastSync'),
      pendingChanges: 0,
      isSyncing: this.syncInProgress
    };

    offlineDb.getPendingSyncRecords().then(pending => {
      status.pendingChanges = 
        pending.students.length + 
        pending.payments.length + 
        pending.attendance.length +
        pending.teachers.length +
        pending.staff.length +
        pending.salaryPayments.length +
        pending.staffSalaryPayments.length;

      this.syncListeners.forEach(listener => listener(status));
    });
  }

  public async syncAllData() {
    if (!this.isOnline || this.syncInProgress) return;

    this.syncInProgress = true;
    this.notifyListeners();

    try {
      await this.syncStudents();
      await this.syncFeePayments();
      await this.syncAttendanceRecords();
      await this.syncTeachers();
      await this.syncStaff();
      await this.syncSalaryPayments();
      await this.syncStaffSalaryPayments();
      await this.downloadAllFromServer();

      localStorage.setItem('lastSync', new Date().toISOString());
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncInProgress = false;
      this.notifyListeners();
    }
  }

  private async downloadAllFromServer() {
    try {
      // Fetch all data in parallel for speed
      const [studentsRes, teachersRes, staffRes, feePaymentsRes, salaryPaymentsRes, staffSalaryPaymentsRes, attendanceRes] = await Promise.all([
        supabase.from('students').select('*'),
        supabase.from('teachers').select('*'),
        supabase.from('staff').select('*'),
        supabase.from('fee_payments').select('*'),
        supabase.from('salary_payments').select('*'),
        supabase.from('staff_salary_payments').select('*'),
        supabase.from('attendance_records').select('*')
      ]);

      // Get all pending sync IDs to avoid overwriting
      const pendingStudents = new Set((await offlineDb.students.where('_sync_pending').equals(1).primaryKeys()));
      const pendingTeachers = new Set((await offlineDb.teachers.where('_sync_pending').equals(1).primaryKeys()));
      const pendingStaff = new Set((await offlineDb.staff.where('_sync_pending').equals(1).primaryKeys()));
      const pendingFeePayments = new Set((await offlineDb.feePayments.where('_sync_pending').equals(1).primaryKeys()));
      const pendingSalaryPayments = new Set((await offlineDb.salaryPayments.where('_sync_pending').equals(1).primaryKeys()));
      const pendingStaffSalaryPayments = new Set((await offlineDb.staffSalaryPayments.where('_sync_pending').equals(1).primaryKeys()));
      const pendingAttendance = new Set((await offlineDb.attendanceRecords.where('_sync_pending').equals(1).primaryKeys()));

      // Bulk put operations - much faster than individual puts
      if (studentsRes.data) {
        const toStore = studentsRes.data.filter(s => !pendingStudents.has(s.id)).map(s => ({ ...s, _sync_pending: 0 }));
        if (toStore.length) await offlineDb.students.bulkPut(toStore);
      }

      if (teachersRes.data) {
        const toStore = teachersRes.data.filter(t => !pendingTeachers.has(t.id)).map(t => ({ ...t, _sync_pending: 0 }));
        if (toStore.length) await offlineDb.teachers.bulkPut(toStore);
      }

      if (staffRes.data) {
        const toStore = staffRes.data.filter(s => !pendingStaff.has(s.id)).map(s => ({ ...s, _sync_pending: 0 }));
        if (toStore.length) await offlineDb.staff.bulkPut(toStore);
      }

      if (feePaymentsRes.data) {
        const toStore = feePaymentsRes.data.filter(p => !pendingFeePayments.has(p.id)).map(p => ({ ...p, _sync_pending: 0 }));
        if (toStore.length) await offlineDb.feePayments.bulkPut(toStore);
      }

      if (salaryPaymentsRes.data) {
        const toStore = salaryPaymentsRes.data.filter(p => !pendingSalaryPayments.has(p.id)).map(p => ({ ...p, _sync_pending: 0 }));
        if (toStore.length) await offlineDb.salaryPayments.bulkPut(toStore);
      }

      if (staffSalaryPaymentsRes.data) {
        const toStore = staffSalaryPaymentsRes.data.filter(p => !pendingStaffSalaryPayments.has(p.id)).map(p => ({ ...p, _sync_pending: 0 }));
        if (toStore.length) await offlineDb.staffSalaryPayments.bulkPut(toStore);
      }

      if (attendanceRes.data) {
        const toStore = attendanceRes.data.filter(a => !pendingAttendance.has(a.id)).map(a => ({ ...a, _sync_pending: 0 }));
        if (toStore.length) await offlineDb.attendanceRecords.bulkPut(toStore);
      }
    } catch (error) {
      console.error('Failed to download data from server:', error);
    }
  }

  private async syncStudents() {
    const pendingStudents = await offlineDb.students.where('_sync_pending').equals(1).toArray();

    for (const student of pendingStudents) {
      try {
        if (student._offline_created) {
          const { error } = await supabase
            .from('students')
            .insert({
              id: student.id,
              student_id: student.student_id,
              name: student.name,
              roll_number: student.roll_number,
              class: student.class,
              section: student.section,
              contact: student.contact,
              address: student.address,
              total_fee: student.total_fee,
              fee_paid: student.fee_paid,
              fee_paid_current_year: student.fee_paid_current_year,
              previous_year_balance: student.previous_year_balance,
              attendance_percentage: student.attendance_percentage,
              remarks: student.remarks,
              photo_url: student.photo_url,
              created_by: student.created_by
            });

          if (error) throw error;
          await offlineDb.markAsSynced('students', student.id);
        } else if (student._offline_updated) {
          const { error } = await supabase
            .from('students')
            .update({
              name: student.name,
              roll_number: student.roll_number,
              class: student.class,
              section: student.section,
              contact: student.contact,
              address: student.address,
              total_fee: student.total_fee,
              fee_paid: student.fee_paid,
              fee_paid_current_year: student.fee_paid_current_year,
              previous_year_balance: student.previous_year_balance,
              attendance_percentage: student.attendance_percentage,
              remarks: student.remarks,
              photo_url: student.photo_url,
              updated_at: new Date().toISOString()
            })
            .eq('id', student.id);

          if (error) throw error;
          await offlineDb.markAsSynced('students', student.id);
        }
      } catch (error) {
        console.error(`Failed to sync student ${student.id}:`, error);
      }
    }
  }

  private async syncFeePayments() {
    const pendingPayments = await offlineDb.feePayments.where('_sync_pending').equals(1).toArray();

    for (const payment of pendingPayments) {
      try {
        if (payment._offline_created) {
          const { error } = await supabase
            .from('fee_payments')
            .insert({
              id: payment.id,
              student_id: payment.student_id,
              amount: payment.amount,
              payment_date: payment.payment_date,
              payment_method: payment.payment_method,
              receipt_number: payment.receipt_number,
              remarks: payment.remarks,
              created_by: payment.created_by
            });

          if (error) throw error;
          await offlineDb.markAsSynced('feePayments', payment.id);
        }
      } catch (error) {
        console.error(`Failed to sync payment ${payment.id}:`, error);
      }
    }
  }

  private async syncAttendanceRecords() {
    const pendingAttendance = await offlineDb.attendanceRecords.where('_sync_pending').equals(1).toArray();

    for (const record of pendingAttendance) {
      try {
        if (record._offline_created) {
          const { error } = await supabase
            .from('attendance_records')
            .insert({
              id: record.id,
              student_id: record.student_id,
              date: record.date,
              status: record.status,
              remarks: record.remarks,
              created_by: record.created_by
            });

          if (error) throw error;
          await offlineDb.markAsSynced('attendanceRecords', record.id);
        }
      } catch (error) {
        console.error(`Failed to sync attendance record ${record.id}:`, error);
      }
    }
  }

  private async syncTeachers() {
    const pendingTeachers = await offlineDb.teachers.where('_sync_pending').equals(1).toArray();

    for (const teacher of pendingTeachers) {
      try {
        if (teacher._offline_created) {
          const { error } = await supabase
            .from('teachers')
            .insert({
              id: teacher.id,
              teacher_id: teacher.teacher_id,
              name: teacher.name,
              subject: teacher.subject,
              contact: teacher.contact,
              email: teacher.email,
              qualification: teacher.qualification,
              experience: teacher.experience,
              salary: teacher.salary,
              level: teacher.level,
              class_taught: teacher.class_taught,
              photo_url: teacher.photo_url,
              created_by: teacher.created_by
            });

          if (error) throw error;
          await offlineDb.markAsSynced('teachers', teacher.id);
        } else if (teacher._offline_updated) {
          const { error } = await supabase
            .from('teachers')
            .update({
              teacher_id: teacher.teacher_id,
              name: teacher.name,
              subject: teacher.subject,
              contact: teacher.contact,
              email: teacher.email,
              qualification: teacher.qualification,
              experience: teacher.experience,
              salary: teacher.salary,
              level: teacher.level,
              class_taught: teacher.class_taught,
              photo_url: teacher.photo_url,
              updated_at: new Date().toISOString()
            })
            .eq('id', teacher.id);

          if (error) throw error;
          await offlineDb.markAsSynced('teachers', teacher.id);
        }
      } catch (error) {
        console.error(`Failed to sync teacher ${teacher.id}:`, error);
      }
    }
  }

  private async syncStaff() {
    const pendingStaff = await offlineDb.staff.where('_sync_pending').equals(1).toArray();

    for (const s of pendingStaff) {
      try {
        if (s._offline_created) {
          const { error } = await supabase
            .from('staff')
            .insert({
              id: s.id,
              staff_id: s.staff_id,
              name: s.name,
              contact: s.contact,
              address: s.address,
              salary: s.salary,
              photo_url: s.photo_url,
              created_by: s.created_by
            });

          if (error) throw error;
          await offlineDb.markAsSynced('staff', s.id);
        } else if (s._offline_updated) {
          const { error } = await supabase
            .from('staff')
            .update({
              staff_id: s.staff_id,
              name: s.name,
              contact: s.contact,
              address: s.address,
              salary: s.salary,
              photo_url: s.photo_url,
              updated_at: new Date().toISOString()
            })
            .eq('id', s.id);

          if (error) throw error;
          await offlineDb.markAsSynced('staff', s.id);
        }
      } catch (error) {
        console.error(`Failed to sync staff ${s.id}:`, error);
      }
    }
  }

  private async syncSalaryPayments() {
    const pendingPayments = await offlineDb.salaryPayments.where('_sync_pending').equals(1).toArray();

    for (const payment of pendingPayments) {
      try {
        if (payment._offline_created) {
          const { error } = await supabase
            .from('salary_payments')
            .insert({
              id: payment.id,
              teacher_id: payment.teacher_id,
              amount: payment.amount,
              month: payment.month,
              year: payment.year,
              payment_date: payment.payment_date,
              payment_method: payment.payment_method,
              remarks: payment.remarks,
              created_by: payment.created_by
            });

          if (error) throw error;
          await offlineDb.markAsSynced('salaryPayments', payment.id);
        }
      } catch (error) {
        console.error(`Failed to sync salary payment ${payment.id}:`, error);
      }
    }
  }

  private async syncStaffSalaryPayments() {
    const pendingPayments = await offlineDb.staffSalaryPayments.where('_sync_pending').equals(1).toArray();

    for (const payment of pendingPayments) {
      try {
        if (payment._offline_created) {
          const { error } = await supabase
            .from('staff_salary_payments')
            .insert({
              id: payment.id,
              staff_id: payment.staff_id,
              amount: payment.amount,
              month: payment.month,
              year: payment.year,
              payment_date: payment.payment_date,
              payment_method: payment.payment_method,
              remarks: payment.remarks,
              created_by: payment.created_by
            });

          if (error) throw error;
          await offlineDb.markAsSynced('staffSalaryPayments', payment.id);
        }
      } catch (error) {
        console.error(`Failed to sync staff salary payment ${payment.id}:`, error);
      }
    }
  }

  public getStatus(): SyncStatus {
    return {
      isOnline: this.isOnline,
      lastSync: localStorage.getItem('lastSync'),
      pendingChanges: 0,
      isSyncing: this.syncInProgress
    };
  }
}

export const syncService = new SyncService();
