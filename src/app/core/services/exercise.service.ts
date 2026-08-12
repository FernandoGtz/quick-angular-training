import { inject, Injectable } from '@angular/core';
import { query, where, getDocs, addDoc, deleteDoc, doc, collection, collectionData, Firestore, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Exercise } from '../models/exercise.model';

/*
 * Exercise service.
 * Handles the CRUD operations over the 'exercises' Firestore collection,
 * including soft delete (archiving) for exercises still referenced by
 * trainings, hard delete, and dependency checks.
 */
@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private firestore = inject(Firestore);

  /*
   * Creates a new exercise document with an active state.
   * Returns the id of the newly created document.
   */
  async createExercise (exercise: Omit<Exercise, 'id' | 'isActive'>): Promise<string> {
    try {
      const collectionRef = collection(this.firestore, 'exercises');
      const payload = { ...exercise, isActive: true };
      const documentRef = await addDoc(collectionRef, payload);
      return documentRef.id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /*
   * Returns an observable stream of active exercises only.
   * Emits a new array every time the collection changes.
   */
  getExercises(): Observable<Exercise[]> {
    const exerciseRef = collection(this.firestore, 'exercises');
    const q = query(exerciseRef, where('isActive', '==', true));
    return collectionData(q, { idField: 'id' }) as Observable<Exercise[]>;
  }

  /*
   * Returns an observable stream of archived (inactive) exercises.
   * Used to display exercises that were soft-deleted.
   */
  getInactiveExercises(): Observable<Exercise[]> {
    const exerciseRef = collection(this.firestore, 'exercises');
    const q = query(exerciseRef, where('isActive', '==', false));
    return collectionData(q, { idField: 'id' }) as Observable<Exercise[]>;
  }

  /*
   * Returns an observable stream of every exercise, active or archived.
   */
  getAllExercises(): Observable<Exercise[]> {
    const exerciseRef = collection(this.firestore, 'exercises');
    return collectionData(exerciseRef, { idField: 'id' }) as Observable<Exercise[]>;
  }

  /*
   * Fetches a single exercise document by its id.
   * Returns the exercise data or undefined if the document does not exist.
   */
  async getExerciseById(id: string): Promise<Exercise | undefined> {
    try {
      const exerciseSnap = await getDoc(doc(this.firestore, 'exercises', id));
      if (exerciseSnap.exists()) {
        return { id: exerciseSnap.id, ...exerciseSnap.data() } as Exercise;
      } else {
        console.error(`Exercise with id not found: ${id}`);
        return undefined;
      }
    } catch (error) {
      console.error('Error getting the exercise:', error);
      throw error;
    }
  }

  /*
   * Partially updates an existing exercise document.
   */
  async updateExercise(id: string, data: Partial<Omit<Exercise, 'id' | 'isActive'>>): Promise<void> {
    try {
      const exerciseRef = doc(this.firestore, 'exercises', id);
      await updateDoc(exerciseRef, data);
      console.log(`Exercise updated.`);
    } catch (error) {
      console.error('Error updating the exercise:', error);
      throw error;
    }
  }

  /*
   * Changes the active state (isActive) of an exercise document.
   * Used to archive or reactivate an exercise.
   */
  async changeExerciseState(id: string, state: boolean): Promise<void> {
    try {
      // Prepare the reference to the document
      const exerciseRef = doc(this.firestore, 'exercises', id);

      // Execute the direct mutation over the boolean field.
      await updateDoc(exerciseRef, { isActive: state });
    } catch (error) {
      console.error('Error changing exercise state:', error);
      throw error;
    }
  }

  /*
   * Permanently deletes an exercise document.
   */
  async deleteExercise(id: string): Promise<void> {
    try {
      // Look up the reference of the document we want to modify
      const exerciseRef = doc(this.firestore, 'exercises', id);
      await deleteDoc(exerciseRef);
      console.log(exerciseRef, "Was successfully deleted");
    } catch (error) {
      console.error("Error trying to delete", error);
      throw error;
    }
  }

  /*
   * Checks whether an exercise is referenced by any training document.
   * Returns true when at least one related training is found.
   */
  async checkExerciseDependencies(exerciseId: string): Promise<boolean> {
    // Reference to the trainings collection
    const trainingsRef = collection(this.firestore, 'trainings');

    // Build and run the query to search for dependencies
    const q = query(trainingsRef, where('exercisesIds', 'array-contains', exerciseId));
    const querySnapshot = await getDocs(q);

    // If there are no related documents, return false
    return !querySnapshot.empty;
  }

  /*
   * Orchestrates the deletion of an exercise.
   * If the exercise is still used by a training, it performs a soft
   * delete (archiving); otherwise it performs a hard delete.
   * Returns a string indicating which strategy was applied.
   */
  async processExerciseDeletion(id: string): Promise<string> {
    // Check whether the exercise is in use, awaiting the promise
    const hasDependencies = await this.checkExerciseDependencies(id);

    if (hasDependencies) {
      // Apply a soft delete
      await this.changeExerciseState(id, false);
      return 'SOFT_DELETE';
    } else {
      // Execute a hard delete
      await this.deleteExercise(id);
      return 'HARD_DELETE';
    }
  }
}
