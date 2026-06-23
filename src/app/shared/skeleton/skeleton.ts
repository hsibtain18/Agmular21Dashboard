import { Component, input } from '@angular/core';

// ─── Stat card skeleton ──────────────────────────────────────────────────────

@Component({
  selector: 'pulse-stat-card-skeleton',
  template: `
    <div class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="h-8 w-8 animate-pulse rounded-lg bg-slate-200"></div>
        <div class="h-4 w-16 animate-pulse rounded-md bg-slate-200"></div>
      </div>
      <div class="mt-4 h-8 w-24 animate-pulse rounded-md bg-slate-200"></div>
      <div class="mt-2 h-3 w-32 animate-pulse rounded-md bg-slate-100"></div>
    </div>
  `,
})
export class StatCardSkeleton {}

// ─── Activity row skeleton ───────────────────────────────────────────────────

@Component({
  selector: 'pulse-activity-skeleton',
  template: `
    <div class="flex items-start gap-3 py-3">
      <div class="mt-0.5 h-8 w-8 flex-shrink-0 animate-pulse rounded-full bg-slate-200"></div>
      <div class="flex flex-1 flex-col gap-1.5">
        <div class="h-3 w-3/4 animate-pulse rounded-md bg-slate-200"></div>
        <div class="h-3 w-1/3 animate-pulse rounded-md bg-slate-100"></div>
      </div>
    </div>
  `,
})
export class ActivityRowSkeleton {}

// ─── Task row skeleton ───────────────────────────────────────────────────────

@Component({
  selector: 'pulse-task-skeleton',
  template: `
    <div class="flex items-center gap-3 rounded-lg border border-slate-100 bg-white px-4 py-3">
      <div class="h-4 w-4 animate-pulse rounded bg-slate-200"></div>
      <div class="h-4 flex-1 animate-pulse rounded-md bg-slate-200"></div>
      <div class="h-5 w-16 animate-pulse rounded-full bg-slate-100"></div>
    </div>
  `,
})
export class TaskRowSkeleton {}

// ─── Team card skeleton ──────────────────────────────────────────────────────

@Component({
  selector: 'pulse-team-skeleton',
  template: `
    <div class="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-white p-4">
      <div class="h-12 w-12 animate-pulse rounded-full bg-slate-200"></div>
      <div class="h-3 w-20 animate-pulse rounded-md bg-slate-200"></div>
      <div class="h-3 w-14 animate-pulse rounded-md bg-slate-100"></div>
    </div>
  `,
})
export class TeamCardSkeleton {}