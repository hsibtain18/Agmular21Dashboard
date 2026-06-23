// Angular 22 signal store pattern — no NgRx, no BehaviorSubject.
// A plain @Injectable with signals as public state. Every consumer reads the
// signal; Angular's fine-grained reactivity ensures only the view that reads a
// changed signal re-renders (zoneless + OnPush default in v22).

import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { ActivityEvent, Task, TaskStatus, TeamMember } from './Models';
import { MockApiService } from './mock-api';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private api = inject(MockApiService);

  // ─── Stats ──────────────────────────────────────────────────────────────
  // resource() is stable in v22. The loader returns a Promise; Angular wraps
  // it into .isLoading(), .value(), .error() signals automatically.
  readonly statsResource = resource({
    loader: () => this.api.getStats(),
  });

  // ─── Tasks ──────────────────────────────────────────────────────────────
  readonly tasksResource = resource({
    loader: () => this.api.getTasks(),
  });

  // A local writable copy so we can optimistically update without refetching.
  // Seeded from the resource once it resolves.
  readonly tasks = signal<Task[]>([]);

  // Derived signals — computed() re-evaluates only when tasks() changes.
  readonly todoTasks     = computed(() => this.tasks().filter(t => t.status === 'todo'));
  readonly inProgTasks   = computed(() => this.tasks().filter(t => t.status === 'in_progress'));
  readonly doneTasks     = computed(() => this.tasks().filter(t => t.status === 'done'));
  readonly totalTasks    = computed(() => this.tasks().length);

  // ─── Team ────────────────────────────────────────────────────────────────
  readonly teamResource = resource({
    loader: () => this.api.getTeam(),
  });

  readonly team = signal<TeamMember[]>([]);

  readonly onlineCount = computed(() =>
    this.team().filter(m => m.status === 'online').length,
  );

  // ─── Activity ────────────────────────────────────────────────────────────
  readonly activityResource = resource({
    loader: () => this.api.getActivity(),
  });

  readonly activity = signal<ActivityEvent[]>([]);

  // ─── Filter/Search ───────────────────────────────────────────────────────
  // Driving UI from a single signal keeps the search bar and list in sync
  // without any form subscription plumbing.
  readonly searchQuery = signal('');

  readonly filteredTasks = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return q ? this.tasks().filter(t => t.title.toLowerCase().includes(q)) : this.tasks();
  });

  // ─── Mutations ───────────────────────────────────────────────────────────

  moveTask(id: string, newStatus: TaskStatus): void {
    // Optimistic update: mutate the local signal immediately so the UI feels
    // instant, then fire the API call in the background.
    this.tasks.update(list =>
      list.map(t => t.id === id ? { ...t, status: newStatus } : t),
    );
    this.api.updateTaskStatus(id, newStatus).catch(() => {
      // Roll back on failure (simplified; real app would show a toast).
      this.tasksResource.reload();
    });
  }

  pushActivity(event: ActivityEvent): void {
    // Prepend so the feed is newest-first.
    this.activity.update(list => [event, ...list].slice(0, 20));
  }

  // ─── Bootstrap helpers ──────────────────────────────────────────────────
  // Called once from the Board component's constructor to seed local signals
  // from the resolved resource values.

  seedTasks(tasks: Task[]): void     { this.tasks.set(tasks); }
  seedTeam(team: TeamMember[]): void  { this.team.set(team); }
  seedActivity(ev: ActivityEvent[]): void { this.activity.set(ev); }
}