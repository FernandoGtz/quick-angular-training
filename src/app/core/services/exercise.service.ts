import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Exercise } from '../models/exercise.model';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private firestore = inject(Firestore);

  async createExercise (exercise: Omit<Exercise, 'id'>): Promise<string> {
    try {
      const collectionRef = collection(this.firestore, 'exercises');
      const documentRef = await addDoc(collectionRef, exercise);
      return documentRef.id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getExercises(): Observable<Exercise[]> {
    const exerciseRef = collection(this.firestore, 'exercises');
    return collectionData(exerciseRef, { idField: 'id' }) as Observable<Exercise[]>;
  }
}
