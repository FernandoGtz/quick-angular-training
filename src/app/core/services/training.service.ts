import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Training } from '../models/training.model';
import { Observable } from 'rxjs';
import { Partner } from '../models/partner.model';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private firestore = inject(Firestore);

  getTrainings(): Observable<Training[]> {
    const trainingRef = collection(this.firestore, 'trainings');
    return collectionData(trainingRef, { idField: 'id' }) as Observable<Training[]>;
  }

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
}
