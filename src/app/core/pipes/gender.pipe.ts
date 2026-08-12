import { Pipe, PipeTransform } from '@angular/core';

/*
 * Display labels used by the gender pipe.
 * Keys are the stored gender values and values are the labels shown to
 * the user in the interface.
 */
const GENDER_LABELS: Record<string, string> = {
  MALE: 'Masculino',
  FEMALE: 'Femenino',
  NON: 'No especificado',
};

/*
 * Gender pipe.
 * Transforms a stored gender value into its user-facing label,
 * falling back to the raw value when the key is unknown.
 */
@Pipe({
  standalone: true,
  name: 'gender'
})
export class GenderPipe implements PipeTransform {
  /* Returns the display label for the given gender value. */
  transform(value: string): string {
    return GENDER_LABELS[value] ?? value;
  }
}
