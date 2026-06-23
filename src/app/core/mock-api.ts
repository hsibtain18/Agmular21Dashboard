// Angular 22 note: @Service() is the new shorthand for @Injectable({ providedIn: 'root' }).
// Using it here instead of the old decorator.
// resource() / httpResource() are stable in v22 — no experimental flag needed.

import { Injectable } from '@angular/core';
import type { StatCard, Task, TeamMember, ActivityEvent } from './Models';

// ─── Seed data ──────────────────────────────────────────────────────────────

const STAT_CARDS: StatCard[] = [
  { id: 's1', label: 'Open Tasks',    value: 34,  trend: 'up',   delta:  8, icon: 'tasks'    },
  { id: 's2', label: 'Team Members',  value: 12,  trend: 'flat', delta:  0, icon: 'members'  },
  { id: 's3', label: 'Velocity',      value: 91,  unit: 'pts',   trend: 'up',   delta: 14, icon: 'velocity' },
  { id: 's4', label: 'Blockers',      value: 3,   trend: 'down', delta: -2, icon: 'blockers' },
];

const TASKS: Task[] = [
  { id: 't1', title: 'Migrate auth to Signal Forms',    status: 'in_progress', priority: 'high',   assigneeId: 'm1', dueDate: '2026-06-25' },
  { id: 't2', title: 'Write Vitest suite for Board',    status: 'todo',        priority: 'medium', assigneeId: 'm2', dueDate: '2026-06-27' },
  { id: 't3', title: 'Deploy Stats panel to Vercel',    status: 'done',        priority: 'low',    assigneeId: 'm3', dueDate: '2026-06-20' },
  { id: 't4', title: 'Wire httpResource to CoinGecko',  status: 'in_progress', priority: 'high',   assigneeId: 'm1', dueDate: '2026-06-24' },
  { id: 't5', title: 'Add @defer on viewport to Stats', status: 'todo',        priority: 'medium', assigneeId: 'm4', dueDate: '2026-06-28' },
  { id: 't6', title: 'Zoneless proof-of-concept demo',  status: 'done',        priority: 'high',   assigneeId: 'm2', dueDate: '2026-06-19' },
  { id: 't7', title: 'Selectorless Avatar components',  status: 'todo',        priority: 'low',    assigneeId: 'm3', dueDate: '2026-06-30' },
];

const MEMBERS: TeamMember[] = [
  { id: 'm1', name: 'Hassan S.',   role: 'Lead FE',      avatarInitials: 'HS', avatarColor: 'bg-[#FF5A3C]', status: 'online',  tasksOpen: 2 },
  { id: 'm2', name: 'Leila M.',    role: 'FE Engineer',  avatarInitials: 'LM', avatarColor: 'bg-violet-500', status: 'online',  tasksOpen: 1 },
  { id: 'm3', name: 'Rayan A.',    role: 'BE Engineer',  avatarInitials: 'RA', avatarColor: 'bg-emerald-500',status: 'away',    tasksOpen: 3 },
  { id: 'm4', name: 'Sara K.',     role: 'Designer',     avatarInitials: 'SK', avatarColor: 'bg-sky-500',    status: 'offline', tasksOpen: 1 },
  { id: 'm5', name: 'Omar H.',     role: 'QA',           avatarInitials: 'OH', avatarColor: 'bg-amber-500',  status: 'online',  tasksOpen: 0 },
];

const ACTIVITY_SEED: ActivityEvent[] = [
  { id: 'a1', actor: 'Hassan S.',  action: 'moved',    target: 'Deploy Stats → Done',          timestamp: new Date(), type: 'task'    },
  { id: 'a2', actor: 'Leila M.',   action: 'commented', target: 'Zoneless proof-of-concept',   timestamp: new Date(Date.now() - 90_000),  type: 'comment' },
  { id: 'a3', actor: 'Rayan A.',   action: 'opened',   target: 'Selectorless Avatar task',      timestamp: new Date(Date.now() - 240_000), type: 'task'    },
  { id: 'a4', actor: 'CI/CD',      action: 'deployed', target: 'main → production (v2.4.1)',   timestamp: new Date(Date.now() - 600_000), type: 'deploy'  },
  { id: 'a5', actor: 'Sara K.',    action: 'joined',   target: 'Pulse workspace',               timestamp: new Date(Date.now() - 3_600_000),type: 'member' },
];

// ─── Fake network delay helper ───────────────────────────────────────────────

function fakeApi<T>(data: T, delayMs = 800): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), delayMs));
}

// ─── Service ────────────────────────────────────────────────────────────────

// Using @Injectable + providedIn: 'root' (standard stable API).
// Angular 22 also ships @Service() as a shorthand but that's stage-3 decorator;
// sticking to @Injectable for maximum compatibility during the sprint.
@Injectable({ providedIn: 'root' })
export class MockApiService {
  /** Simulates /api/stats — 0.6 s delay */
  getStats(): Promise<StatCard[]> {
    return fakeApi(STAT_CARDS, 600);
  }

  /** Simulates /api/tasks — 0.9 s delay */
  getTasks(): Promise<Task[]> {
    return fakeApi(TASKS, 900);
  }

  /** Simulates /api/team — 0.7 s delay */
  getTeam(): Promise<TeamMember[]> {
    return fakeApi(MEMBERS, 700);
  }

  /** Simulates /api/activity — 0.5 s delay */
  getActivity(): Promise<ActivityEvent[]> {
    return fakeApi(ACTIVITY_SEED, 500);
  }

  /** Simulates adding a new task (POST /api/tasks) */
  createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const newTask: Task = { ...task, id: `t${Date.now()}` };
    return fakeApi(newTask, 300);
  }

  /** Simulates patching task status (PATCH /api/tasks/:id) */
  updateTaskStatus(id: string, status: Task['status']): Promise<Task> {
    const found = TASKS.find((t) => t.id === id);
    if (!found) return Promise.reject(new Error(`Task ${id} not found`));
    const updated = { ...found, status };
    return fakeApi(updated, 250);
  }
}