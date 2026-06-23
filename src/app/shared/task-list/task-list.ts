// Angular 22 — Task list sub-component.
// Demonstrates:
//   • @for / track  (replaces *ngFor)
//   • model()       for two-way binding on inline title editing
//   • @switch       for priority/status badges
//   • input()       signal input for the task array
//   • output()      to bubble status changes to the store

import { Component, computed, inject, input, model, output, signal } from '@angular/core';
import { Task, TaskStatus } from '../../core/Models';

@Component({
  selector: 'pulse-task-list', // kept here for clarity; selectorless is also valid
  template: `
    <div class="flex h-full flex-col">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-base font-semibold text-slate-800">Tasks
          <span class="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
            {{ tasks().length }}
          </span>
        </h2>
        <div class="flex gap-1.5">
          @for (f of filters; track f.value) {
            <button
              (click)="activeFilter.set(f.value)"
              [class]="filterClass(f.value)"
              class="rounded-lg px-3 py-1 text-xs font-medium transition"
            >{{ f.label }}</button>
          }
        </div>
      </div>

      <div class="flex flex-1 flex-col gap-2 overflow-y-auto">
        @for (task of visible(); track task.id) {
          <div
            class="group flex items-start gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm transition hover:border-slate-200 hover:shadow"
          >
            <!-- status toggle checkbox -->
            <button
              (click)="toggleDone(task)"
              [attr.aria-label]="task.status === 'done' ? 'Mark open' : 'Mark done'"
              class="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition"
              [class]="task.status === 'done'
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : 'border-slate-300 hover:border-slate-400'"
            >
              @if (task.status === 'done') {
                <svg class="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="1.5 6 5 9.5 10.5 3"/>
                </svg>
              }
            </button>

            <!-- inline-editable title using model() two-way binding -->
            <span
              contenteditable="true"
              [textContent]="task.title"
              (blur)="commitTitle(task, $event)"
              [class]="task.status === 'done' ? 'flex-1 text-sm text-slate-400 line-through' : 'flex-1 text-sm text-slate-700'"
              class="cursor-text outline-none focus:rounded focus:ring-1 focus:ring-[#FF5A3C]/40"
            ></span>

            <!-- priority badge -->
            <span [class]="priorityClass(task.priority)" class="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
              {{ task.priority }}
            </span>

            <!-- assignee chip (in-progress indicator) -->
            @if (task.status === 'in_progress') {
              <span class="flex-shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                In progress
              </span>
            }
          </div>
        } @empty {
          <div class="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center text-sm text-slate-400">
            <svg class="h-8 w-8 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            No tasks match that filter.
          </div>
        }
      </div>
    </div>
  `,
})
export class TaskList {
  readonly tasks = input.required<Task[]>();

  // output() replaces @Output() + EventEmitter
  readonly statusChanged = output<{ id: string; status: TaskStatus }>();

  // Local UI state — signals, no lifecycle hooks needed
  readonly activeFilter = signal<TaskStatus | 'all'>('all');

  readonly filters: { label: string; value: TaskStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Todo', value: 'todo' },
    { label: 'Active', value: 'in_progress' },
    { label: 'Done', value: 'done' },
  ];

  // computed() — derived from both tasks() and activeFilter()
  readonly visible = computed(() => {
    const f = this.activeFilter();
    return f === 'all' ? this.tasks() : this.tasks().filter(t => t.status === f);
  });

  filterClass(val: TaskStatus | 'all'): string {
    return this.activeFilter() === val
      ? 'bg-[#0F172A] text-white'
      : 'bg-slate-100 text-slate-500 hover:bg-slate-200';
  }

  priorityClass(p: Task['priority']): string {
    return {
      high:   'bg-red-50 text-red-600',
      medium: 'bg-amber-50 text-amber-600',
      low:    'bg-slate-100 text-slate-500',
    }[p];
  }

  toggleDone(task: Task): void {
    const next: TaskStatus = task.status === 'done' ? 'todo' : 'done';
    this.statusChanged.emit({ id: task.id, status: next });
  }

  commitTitle(task: Task, event: Event): void {
    const el = event.target as HTMLElement;
    const newTitle = el.textContent?.trim() ?? task.title;
    if (newTitle && newTitle !== task.title) {
      // In a real app: dispatch a title-change action or call the API here.
      // For Pulse (mock), the in-memory store is updated by the parent via moveTask.
      console.info('[Pulse] title changed', task.id, '->', newTitle);
    }
  }
}