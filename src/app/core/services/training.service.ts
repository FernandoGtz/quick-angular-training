import { inject, Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, collectionData, Firestore, getDoc, updateDoc, } from '@angular/fire/firestore';
import { Training } from '../models/training.model';
import { Observable } from 'rxjs';

/*
 * Training service.
 * Handles the CRUD operations over the 'trainings' Firestore collection.
 * Each training references a partner and a list of exercise ids.
 */
@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private firestore = inject(Firestore);

  /*
   * Creates a new training document and returns its id.
   */
  async createTraining(training: Omit<Training, 'id'>): Promise<string> {
    try {
      const collectionRef = collection(this.firestore, 'trainings');
      const documentRef = await addDoc(collectionRef, training);
      return documentRef.id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /*
   * Returns an observable stream of all trainings.
   */
  getTrainings(): Observable<Training[]> {
    const trainingRef = collection(this.firestore, 'trainings');
    return collectionData(trainingRef, { idField: 'id' }) as Observable<Training[]>;
  }

  /*
   * Fetches a single training document by its id.
   * Returns the training data or undefined if the document does not exist.
   */
  async getTrainingById(id: string): Promise<Training | undefined> {
    try {
      const trainingSnap = await getDoc(doc(this.firestore, 'trainings', id));
      if (trainingSnap.exists()) {
        // Extract the data and inject the snapshot id manually
        return { id: trainingSnap.id, ...trainingSnap.data() } as Training;
      } else {
        console.error(`Training with id not found: ${id}`);
        return undefined;
      }
    } catch (error) {
      console.error('Error getting the training:', error);
      throw error;
    }
  }

  /*
   * Partially updates an existing training document.
   */
  async updateTraining(id: string, data: Partial<Omit<Training, 'id'>>): Promise<void> {
    try {
      // Look up the document reference in the trainings collection to update it directly
      const trainingRef = doc(this.firestore, 'trainings', id);
      await updateDoc(trainingRef, data);
      console.log(`Training updated.`);
    } catch (error) {
      console.error('Error trying to update the training', error);
      throw error;
    }
  }

  /*
   * Deletes a training document permanently.
   */
  async deleteTraining(id: string): Promise<void> {
    try {
      // Look up the document reference in the trainings collection to delete it directly
      await deleteDoc(doc(this.firestore, 'trainings', id));
      console.log(`Training deleted.`);
    } catch (error) {
      console.error('Error trying to delete the training', error);
      throw error;
    }
  }
}
