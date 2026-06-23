

import { Component, DestroyRef, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { ActivityEvent } from '../../core/Models';

// Fake event generator so the feed looks live
function makeFakeEvent(index: number): ActivityEvent {
  const events: Omit<ActivityEvent, 'id' | 'timestamp'>[] = [
    { actor: 'Hassan S.', action: 'moved',    target: 'httpResource task → In Progress', type: 'task'   },
    { actor: 'Leila M.',  action: 'commented', target: 'Vitest suite PR #42',             type: 'comment'},
    { actor: 'CI/CD',     action: 'deployed',  target: 'staging (v2.4.2-rc)',             type: 'deploy' },
    { actor: 'Rayan A.',  action: 'closed',    target: 'API rate-limit blocker',          type: 'task'   },
    { actor: 'Sara K.',   action: 'uploaded',  target: 'new Figma spec — Team screen',   type: 'member' },
  ];
  const e = events[index % events.length];
  return { ...e, id: `live-${Date.now()}`, timestamp: new Date() };
}

@Component({
  selector: 'pulse-activity-feed',
  template: `
    <div class="flex h-full flex-col">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-base font-semibold text-slate-800">Activity</h2>
        <!-- live indicator — pulses faster when events arrive -->
        <span class="flex items-center gap-1.5 text-xs text-slate-400">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF5A3C] opacity-60"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-[#FF5A3C]"></span>
          </span>
          Live
        </span>
      </div>

      <div #feedEl class="flex flex-1 flex-col gap-0.5 overflow-y-auto pr-1">
        @for (event of events(); track event.id) {
          <div class="flex items-start gap-3 border-b border-slate-50 py-3 last:border-none">
            <!-- avatar -->
            <div [class]="avatarClass(event)" class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white">
              {{ initials(event.actor) }}
            </div>

            <div class="min-w-0 flex-1">
              <p class="truncate text-sm text-slate-700">
                <span class="font-medium">{{ event.actor }}</span>
                {{ event.action }}
                <span class="text-slate-500">{{ event.target }}</span>
              </p>
              <p class="mt-0.5 text-[11px] text-slate-400">{{ relativeTime(event.timestamp) }}</p>
            </div>

            <!-- type icon -->
            <div [class]="typeIconBg(event.type)" class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md">
              @switch (event.type) {
                @case ('task')    { <svg class="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1.5 6 5 9.5 10.5 3"/></svg> }
                @case ('comment') { <svg class="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1h10v7H7l-3 3V8H1z"/></svg> }
                @case ('deploy')  { <svg class="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="5"/><path d="M6 3v3l2 2"/></svg> }
                @case ('member')  { <svg class="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5" cy="4" r="2.5"/><path d="M1 11c0-2.2 1.8-4 4-4s4 1.8 4 4"/><path d="M9 2l2 2-3 3"/></svg> }
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class ActivityFeed {
  readonly events = input.required<ActivityEvent[]>();
  readonly newEvent = output<ActivityEvent>();

  // viewChild() — signal-based @ViewChild replacement (Angular 17.3+, stable in v22)
  private feedEl = viewChild<ElementRef<HTMLDivElement>>('feedEl');

  private readonly destroyRef = inject(DestroyRef);
  private liveCount = signal(0);

  constructor() {
    // effect() reacts to signal changes without subscribing or using ngOnChanges.
    // Auto-scroll feed to top whenever events() changes (new item prepended).
    effect(() => {
      // Read the signal inside the effect to register the dependency.
      void this.events().length;
      const el = this.feedEl()?.nativeElement;
      if (el) el.scrollTop = 0;
    });

    // ── Zoneless proof point ────────────────────────────────────────────────
    // setInterval runs outside Angular in a zoneless app. The only way the view
    // updates is because we mutate a signal, which marks the view dirty via
    // Angular's signal-aware scheduler — no Zone.js patch needed.
    let tick = 0;
    const id = setInterval(() => {
      const event = makeFakeEvent(tick++);
      this.newEvent.emit(event); // parent store prepends + updates its signal
    }, 5000); // new event every 5 s

    this.destroyRef.onDestroy(() => clearInterval(id));
  }

  initials(name: string): string {
    return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  }

  avatarClass(event: ActivityEvent): string {
    const map: Record<ActivityEvent['type'], string> = {
      task: 'bg-[#FF5A3C]', comment: 'bg-violet-500', deploy: 'bg-emerald-500', member: 'bg-sky-500',
    };
    return map[event.type];
  }

  typeIconBg(type: ActivityEvent['type']): string {
    const map: Record<ActivityEvent['type'], string> = {
      task: 'bg-red-50 text-[#FF5A3C]', comment: 'bg-violet-50 text-violet-500',
      deploy: 'bg-emerald-50 text-emerald-600', member: 'bg-sky-50 text-sky-500',
    };
    return map[type];
  }

  relativeTime(date: Date): string {
    const diffMs = Date.now() - date.getTime();
    const s = Math.floor(diffMs / 1000);
    if (s < 60)  return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60)  return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24)  return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }
}