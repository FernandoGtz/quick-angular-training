import { Pipe, PipeTransform } from '@angular/core';

const GENDER_LABELS: Record<string, string> = {
  MALE: 'Masculino',
  FEMALE: 'Femenino',
  NON: 'No especificado',
};

@Pipe({
  standalone: true,
  name: 'gender'
})
export class GenderPipe implements PipeTransform {
  transform(value: string): string {
    return GENDER_LABELS[value] ?? value;
  }
}
