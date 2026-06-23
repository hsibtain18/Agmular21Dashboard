// ─── Dashboard domain models ───────────────────────────────────────────────
// Single source of truth for types used across every sub-component.

export interface StatCard {
  id: string;
  label: string;
  value: number;
  unit?: string;
  delta: number;      // percentage change vs last period
  trend: 'up' | 'down' | 'flat';
  icon: 'tasks' | 'members' | 'velocity' | 'blockers';
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string;      // ISO date string
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
  avatarColor: string;  // Tailwind bg class
  status: 'online' | 'away' | 'offline';
  tasksOpen: number;
}

export interface ActivityEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: Date;
  type: 'task' | 'comment' | 'member' | 'deploy';
}