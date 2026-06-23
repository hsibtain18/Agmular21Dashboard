

import {
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { DashboardStore } from '../../core/DashboardStore';

import { AuthService } from '../../core/auth';
import { ActivityFeed } from '../../shared/activity-feed/activity-feed';
import { TaskList } from '../../shared/task-list/task-list';
import { StatCardComponent } from '../../shared/stat-card/stat-card';
import { ActivityRowSkeleton, StatCardSkeleton, TaskRowSkeleton, TeamCardSkeleton } from '../../shared/skeleton/skeleton';
import { TeamMemberCard } from '../../shared/team-member-card/team-member-card';
import { ActivityEvent, TaskStatus } from '../../core/Models';

@Component({
  selector: 'app-board',
  imports: [
    // Sub-components — all standalone. In Angular 22 selectorless ones are
    // imported the same way; the template uses the class name directly.
    ActivityFeed,
    TaskList,
    StatCardComponent,
    TeamMemberCard,
    StatCardSkeleton,
    ActivityRowSkeleton,
    TaskRowSkeleton,
    TeamCardSkeleton,
  ],
  templateUrl: './board.html',
})
export class Board {
  protected readonly store = inject(DashboardStore);
  private readonly auth   = inject(AuthService);
  private readonly router = inject(Router);

  // ── Sidebar toggle (mobile) ──────────────────────────────────────────────
  protected readonly sidebarOpen = signal(false);

  // ── Search — driven purely by signal, no FormControl needed for a single
  //    input. Signal Forms would be overkill here; reserve them for Settings.
  protected readonly query = signal('');

  // Bind the store query signal to the local one.
  constructor() {
    effect(() => {
      this.store.searchQuery.set(this.query());
    });

    // Seed local signals from resolved resources.
    // effect() re-runs whenever the resource value changes; once loaded it
    // fires once and never again unless the resource reloads.
    effect(() => {
      const tasks = this.store.tasksResource.value();
      if (tasks) this.store.seedTasks(tasks);
    });

    effect(() => {
      const team = this.store.teamResource.value();
      if (team) this.store.seedTeam(team);
    });

    effect(() => {
      const activity = this.store.activityResource.value();
      if (activity) this.store.seedActivity(activity);
    });
  }

  // ── Derived from store signals ───────────────────────────────────────────
  protected readonly stats      = computed(() => this.store.statsResource.value() ?? []);
  protected readonly statsLoading = computed(() => this.store.statsResource.isLoading());

  protected readonly tasks      = computed(() => this.store.filteredTasks());
  protected readonly tasksLoading = computed(() => this.store.tasksResource.isLoading());

  protected readonly team       = computed(() => this.store.team());
  protected readonly teamLoading = computed(() => this.store.teamResource.isLoading());

  protected readonly activity   = computed(() => this.store.activity());
  protected readonly activityLoading = computed(() => this.store.activityResource.isLoading());

  protected readonly onlineCount = computed(() => this.store.onlineCount());
  protected readonly totalTasks  = computed(() => this.store.totalTasks());

  // ── Event handlers ───────────────────────────────────────────────────────
  protected onStatusChange(ev: { id: string; status: TaskStatus }): void {
    this.store.moveTask(ev.id, ev.status);
  }

  protected onNewActivity(event: ActivityEvent): void {
    this.store.pushActivity(event);
  }

  protected onSearch(ev: Event): void {
    this.query.set((ev.target as HTMLInputElement).value);
  }

  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}