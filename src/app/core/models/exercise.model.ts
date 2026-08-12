/*
 * Exercise model.
 * Represents a gym exercise stored in Firestore, including the muscle
 * group it targets and an active flag used to archive exercises.
 */
export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  isActive: boolean;
}
