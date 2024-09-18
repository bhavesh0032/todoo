export interface Task {
    id?: number;
    title: string;
    status: 'todo' | 'in_progress' | 'done';
    created_at?: string;
  }