/*
 * Training model.
 * Represents a workout session stored in Firestore. It references a
 * partner and a list of exercise ids, and stores when it was created.
 */
export interface Training {
  id: string;
  partnerId: string;
  description: string;
  exercisesIds: string[];
  createdAt: Date;
}

/*
 * TrainingView model.
 * Denormalized presentation of a training for the list UI, replacing
 * ids with the human-readable partner name and exercise names.
 */
export interface TrainingView {
  id: string;
  description: string;
  partnerName: string;
  exerciseNames: string[];
}
