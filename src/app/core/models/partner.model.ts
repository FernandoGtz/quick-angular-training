import { Timestamp } from '@angular/fire/firestore';

export type Gender = 'Male' | 'Female' | 'Non';

export interface Partner {
  id: string;
  name: string;
  bornDate: Timestamp;
  gender: Gender;
  cellphoneNumber: number;
  email: string;
  isActive: boolean;
}

