import { Timestamp } from '@angular/fire/firestore';

/*
 * Possible gender values for a partner.
 */
export type Gender = 'Male' | 'Female' | 'Non';

/*
 * Partner model.
 * Represents a gym member stored in Firestore, with personal data,
 * a birth date as a Firestore Timestamp and an active flag.
 */
export interface Partner {
  id: string;
  name: string;
  bornDate: Timestamp;
  gender: Gender;
  cellphoneNumber: number;
  email: string;
  isActive: boolean;
}

