import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

interface FilterOption {
  label: string;
  route: string;
}

interface SectionConfig {
  list: FilterOption;
  new: FilterOption;
}

const SECTIONS: Record<string, SectionConfig> = {
  trainings: {
    list: { label: 'Entrenamientos', route: '/trainings' },
    new:  { label: 'Nuevo entrenamiento', route: '/trainings/new' },
  },
  partners: {
    list: { label: 'Socios', route: '/partners' },
    new:  { label: 'Nuevo socio', route: '/partners/new' },
  },
  exercises: {
    list: { label: 'Ejercicios', route: '/exercises' },
    new:  { label: 'Nuevo ejercicio', route: '/exercises/new' },
  },
};

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './filter-bar.component.component.html',
})
export class FilterBarComponent {
  private router = inject(Router);

  private url = toSignal(
    this.router.events.pipe(map(() => this.router.url)),
    { initialValue: this.router.url }
  );

  section = computed(() => {
    const url = this.url();
    if (url.includes('trainings')) return SECTIONS['trainings'];
    if (url.includes('partners'))  return SECTIONS['partners'];
    if (url.includes('exercises')) return SECTIONS['exercises'];
    return null;
  });
}
