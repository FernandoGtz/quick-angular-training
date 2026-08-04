export interface Training {
  id: string;
  partnerId: string;
  description: string;
  exercisesIds: string[];
  createdAt: Date;
}

export interface TrainingView {
  id: string;
  description: string;
  partnerName: string;
  exerciseNames: string[];
}
