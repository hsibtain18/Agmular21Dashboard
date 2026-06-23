import { Component, computed, input } from '@angular/core';
import { StatCard } from '../../core/Models';

@Component({
  selector: 'pulse-stat-card',
  template: `
    <div class="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div [class]="accentBar()" class="absolute inset-x-0 top-0 h-0.5"></div>

      <div class="flex items-start justify-between">
        <div [class]="iconBg()" class="flex h-9 w-9 items-center justify-center rounded-xl text-white">
          @switch (card().icon) {
            @case ('tasks')    { <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> }
            @case ('members')  { <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
            @case ('velocity') { <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
            @case ('blockers') { <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> }
          }
        </div>

        <span [class]="deltaBadge()" class="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold">
          @if (card().trend === 'up')   { ↑ }
          @if (card().trend === 'down') { ↓ }
          @if (card().trend === 'flat') { → }
          {{ card().delta > 0 ? '+' : '' }}{{ card().delta }}%
        </span>
      </div>

      <p class="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        {{ card().value }}<span class="ml-0.5 text-sm font-medium text-slate-400">{{ card().unit ?? '' }}</span>
      </p>
      <p class="mt-1 text-sm text-slate-500">{{ card().label }}</p>
    </div>
  `,
})
export class StatCardComponent {
  readonly card = input.required<StatCard>();

  readonly accentBar = computed(() => {
    const t = this.card().trend;
    return t === 'up' ? 'bg-emerald-500' : t === 'down' ? 'bg-red-400' : 'bg-slate-300';
  });

  readonly iconBg = computed(() => {
    const map: Record<StatCard['icon'], string> = {
      tasks: 'bg-[#FF5A3C]', members: 'bg-violet-500', velocity: 'bg-emerald-500', blockers: 'bg-amber-500',
    };
    return map[this.card().icon];
  });

  readonly deltaBadge = computed(() => {
    const t = this.card().trend;
    return t === 'up' ? 'bg-emerald-50 text-emerald-700' : t === 'down' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500';
  });
}