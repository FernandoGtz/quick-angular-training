import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

/*
 * Interface that describes a navigation filter option.
 */
interface FilterOption {
  label: string;
  route: string;
}

/*
 * Interface that describes the navigation configuration of a section.
 */
interface SectionConfig {
  list: FilterOption;
  new: FilterOption;
}

/*
 * Static navigation configuration for each CRUD section.
 */
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

/*
 * Filter bar component.
 * Shows the "list" and "new" navigation actions of the section that
 * matches the current URL, keeping the navigation in sync with the
 * router events through a signal.
 */
@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './filter-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterBarComponent {
  private router = inject(Router);

  private url = toSignal(
    this.router.events.pipe(map(() => this.router.url)),
    { initialValue: this.router.url }
  );

  /* Returns the section configuration matching the current URL or null. */
  section = computed(() => {
    const url = this.url();
    if (url.includes('trainings')) return SECTIONS['trainings'];
    if (url.includes('partners'))  return SECTIONS['partners'];
    if (url.includes('exercises')) return SECTIONS['exercises'];
    return null;
  });
}
