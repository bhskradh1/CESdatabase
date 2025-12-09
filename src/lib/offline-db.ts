import Dexie, { Table } from 'dexie';

// Define the database schema
export interface Student {
  id: string;
  student_id: string;
  name: string;
  roll_number: string;
  class: string;
  section?: string;
  contact?: string;
  address?: string;
  total_fee?: number;
  fee_paid?: number;
  fee_paid_current_year?: number;
  previous_year_balance?: number;
  attendance_percentage?: number;
  remarks?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  // Offline sync fields
  _offline_created?: boolean;
  _offline_updated?: boolean;
  _offline_deleted?: boolean;
  _sync_pending?: number;
  _last_sync?: string;
}

export interface FeePayment {
  id: string;
  student_id: string;
  amount: number;
  payment_date: string;
  payment_method?: string;
  receipt_number?: string;
  remarks?: string;
  created_at: string;
  created_by: string;
  // Offline sync fields
  _offline_created?: boolean;
  _offline_updated?: boolean;
  _offline_deleted?: boolean;
  _sync_pending?: number;
  _last_sync?: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: string;
  remarks?: string;
  created_at: string;
  created_by: string;
  // Offline sync fields
  _offline_created?: boolean;
  _offline_updated?: boolean;
  _offline_deleted?: boolean;
  _sync_pending?: number;
  _last_sync?: string;
}

export interface Teacher {
  id: string;
  teacher_id?: string;
  name: string;
  subject: string;
  contact: string;
  email: string;
  qualification: string;
  experience: number;
  salary?: number;
  level?: string;
  class_taught?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  // Offline sync fields
  _offline_created?: boolean;
  _offline_updated?: boolean;
  _offline_deleted?: boolean;
  _sync_pending?: number;
  _last_sync?: string;
}

export interface Staff {
  id: string;
  staff_id?: string;
  name: string;
  contact: string;
  address?: string;
  salary?: number;
  photo_url?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  // Offline sync fields
  _offline_created?: boolean;
  _offline_updated?: boolean;
  _offline_deleted?: boolean;
  _sync_pending?: number;
  _last_sync?: string;
}

export interface SalaryPayment {
  id: string;
  teacher_id: string;
  amount: number;
  month: string;
  year: number;
  payment_date: string;
  payment_method?: string;
  remarks?: string;
  created_at: string;
  created_by: string;
  // Offline sync fields
  _offline_created?: boolean;
  _offline_updated?: boolean;
  _offline_deleted?: boolean;
  _sync_pending?: number;
  _last_sync?: string;
}

export interface StaffSalaryPayment {
  id: string;
  staff_id: string;
  amount: number;
  month: string;
  year: number;
  payment_date: string;
  payment_method?: string;
  remarks?: string;
  created_at: string;
  created_by: string;
  // Offline sync fields
  _offline_created?: boolean;
  _offline_updated?: boolean;
  _offline_deleted?: boolean;
  _sync_pending?: number;
  _last_sync?: string;
}

export interface SyncQueue {
  id?: number;
  table: string;
  record_id: string;
  operation: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
  retry_count: number;
}

export class OfflineDatabase extends Dexie {
  students!: Table<Student>;
  feePayments!: Table<FeePayment>;
  attendanceRecords!: Table<AttendanceRecord>;
  teachers!: Table<Teacher>;
  staff!: Table<Staff>;
  salaryPayments!: Table<SalaryPayment>;
  staffSalaryPayments!: Table<StaffSalaryPayment>;
  syncQueue!: Table<SyncQueue>;

  constructor() {
    super('ChampDatabaseOffline');
    
    this.version(2).stores({
      students: 'id, student_id, roll_number, class, section, created_at, _sync_pending',
      feePayments: 'id, student_id, payment_date, created_at, _sync_pending',
      attendanceRecords: 'id, student_id, date, created_at, _sync_pending',
      teachers: 'id, teacher_id, name, created_at, _sync_pending',
      staff: 'id, staff_id, name, created_at, _sync_pending',
      salaryPayments: 'id, teacher_id, month, year, payment_date, _sync_pending',
      staffSalaryPayments: 'id, staff_id, month, year, payment_date, _sync_pending',
      syncQueue: '++id, table, record_id, operation, timestamp, retry_count'
    });

    // Add hooks for automatic sync tracking
    this.students.hook('creating', (primKey, obj, trans) => {
      (obj as any)._offline_created = true;
      (obj as any)._sync_pending = 1;
      (obj as any)._last_sync = new Date().toISOString();
    });

    this.students.hook('updating', (modifications, primKey, obj, trans) => {
      (modifications as any)._offline_updated = true;
      (modifications as any)._sync_pending = 1;
      (modifications as any)._last_sync = new Date().toISOString();
    });

    this.feePayments.hook('creating', (primKey, obj, trans) => {
      (obj as any)._offline_created = true;
      (obj as any)._sync_pending = 1;
      (obj as any)._last_sync = new Date().toISOString();
    });

    this.feePayments.hook('updating', (modifications, primKey, obj, trans) => {
      (modifications as any)._offline_updated = true;
      (modifications as any)._sync_pending = 1;
      (modifications as any)._last_sync = new Date().toISOString();
    });

    this.attendanceRecords.hook('creating', (primKey, obj, trans) => {
      (obj as any)._offline_created = true;
      (obj as any)._sync_pending = 1;
      (obj as any)._last_sync = new Date().toISOString();
    });

    this.attendanceRecords.hook('updating', (modifications, primKey, obj, trans) => {
      (modifications as any)._offline_updated = true;
      (modifications as any)._sync_pending = 1;
      (modifications as any)._last_sync = new Date().toISOString();
    });

    this.teachers.hook('creating', (primKey, obj, trans) => {
      (obj as any)._offline_created = true;
      (obj as any)._sync_pending = 1;
      (obj as any)._last_sync = new Date().toISOString();
    });

    this.teachers.hook('updating', (modifications, primKey, obj, trans) => {
      (modifications as any)._offline_updated = true;
      (modifications as any)._sync_pending = 1;
      (modifications as any)._last_sync = new Date().toISOString();
    });

    this.staff.hook('creating', (primKey, obj, trans) => {
      (obj as any)._offline_created = true;
      (obj as any)._sync_pending = 1;
      (obj as any)._last_sync = new Date().toISOString();
    });

    this.staff.hook('updating', (modifications, primKey, obj, trans) => {
      (modifications as any)._offline_updated = true;
      (modifications as any)._sync_pending = 1;
      (modifications as any)._last_sync = new Date().toISOString();
    });

    this.salaryPayments.hook('creating', (primKey, obj, trans) => {
      (obj as any)._offline_created = true;
      (obj as any)._sync_pending = 1;
      (obj as any)._last_sync = new Date().toISOString();
    });

    this.salaryPayments.hook('updating', (modifications, primKey, obj, trans) => {
      (modifications as any)._offline_updated = true;
      (modifications as any)._sync_pending = 1;
      (modifications as any)._last_sync = new Date().toISOString();
    });

    this.staffSalaryPayments.hook('creating', (primKey, obj, trans) => {
      (obj as any)._offline_created = true;
      (obj as any)._sync_pending = 1;
      (obj as any)._last_sync = new Date().toISOString();
    });

    this.staffSalaryPayments.hook('updating', (modifications, primKey, obj, trans) => {
      (modifications as any)._offline_updated = true;
      (modifications as any)._sync_pending = 1;
      (modifications as any)._last_sync = new Date().toISOString();
    });
  }

  // Helper methods for sync operations
  async getPendingSyncRecords() {
    const pendingStudents = await this.students.where('_sync_pending').equals(1).toArray();
    const pendingPayments = await this.feePayments.where('_sync_pending').equals(1).toArray();
    const pendingAttendance = await this.attendanceRecords.where('_sync_pending').equals(1).toArray();
    const pendingTeachers = await this.teachers.where('_sync_pending').equals(1).toArray();
    const pendingStaff = await this.staff.where('_sync_pending').equals(1).toArray();
    const pendingSalaryPayments = await this.salaryPayments.where('_sync_pending').equals(1).toArray();
    const pendingStaffSalaryPayments = await this.staffSalaryPayments.where('_sync_pending').equals(1).toArray();
    
    return {
      students: pendingStudents,
      payments: pendingPayments,
      attendance: pendingAttendance,
      teachers: pendingTeachers,
      staff: pendingStaff,
      salaryPayments: pendingSalaryPayments,
      staffSalaryPayments: pendingStaffSalaryPayments
    };
  }

  async markAsSynced(table: string, recordId: string) {
    const tableRef = this.table(table as any);
    await tableRef.update(recordId, {
      _sync_pending: 0,
      _last_sync: new Date().toISOString()
    });
  }

  async addToSyncQueue(table: string, recordId: string, operation: 'create' | 'update' | 'delete', data: any) {
    await this.syncQueue.add({
      table,
      record_id: recordId,
      operation,
      data,
      timestamp: new Date().toISOString(),
      retry_count: 0
    });
  }

  async getSyncQueue() {
    return await this.syncQueue.orderBy('timestamp').toArray();
  }

  async clearSyncQueue() {
    await this.syncQueue.clear();
  }
}

// Create and export the database instance
export const offlineDb = new OfflineDatabase();
