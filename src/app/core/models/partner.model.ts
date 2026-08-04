export type Gender = 'Male' | 'Female' | 'Non';

export interface Partner {
  id: string;
  name: string;
  bornDate: Date;
  gender: Gender;
  cellphoneNumber: number;
  email: string;
}

