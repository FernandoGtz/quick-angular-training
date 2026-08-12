import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

/*
 * Pure pipe that converts an optional Firestore Timestamp into a JS Date.
 * Using a pure pipe avoids calling Timestamp.toDate() repeatedly in the
 * template on every change-detection cycle.
 */
@Pipe({
  name: 'timestampDate',
  standalone: true,
  pure: true,
})
export class TimestampDatePipe implements PipeTransform {
  transform(value: Timestamp | undefined | null): Date | null {
    return value?.toDate() ?? null;
  }
}
