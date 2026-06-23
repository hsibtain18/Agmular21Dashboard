import { Component, computed, input } from '@angular/core';
import { TeamMember } from '../../core/Models';

@Component({
  selector: 'pulse-team-member-card',
  template: `
    <div class="relative flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div class="relative">
        <div [class]="member().avatarColor" class="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm">
          {{ member().avatarInitials }}
        </div>

        @switch (member().status) {
          @case ('online')  { <span class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"></span> }
          @case ('away')    { <span class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-amber-400"></span> }
          @case ('offline') { <span class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-slate-300"></span> }
        }
      </div>

      <div class="text-center">
        <p class="text-sm font-semibold text-slate-800">{{ member().name }}</p>
        <p class="text-[11px] text-slate-400">{{ member().role }}</p>
      </div>

      @if (member().tasksOpen > 0) {
        <span [class]="taskBadge()" class="rounded-full px-2.5 py-0.5 text-[10px] font-bold">
          {{ member().tasksOpen }} open
        </span>
      } @else {
        <span class="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">Clear</span>
      }
    </div>
  `,
})
export class TeamMemberCard {
  readonly member = input.required<TeamMember>();

  readonly taskBadge = computed(() =>
    this.member().tasksOpen >= 3 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600',
  );
}