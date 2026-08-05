import { inject, Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, collectionData, Firestore, getDoc, updateDoc, } from '@angular/fire/firestore';
import { Training } from '../models/training.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private firestore = inject(Firestore);

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

  getTrainings(): Observable<Training[]> {
    const trainingRef = collection(this.firestore, 'trainings');
    return collectionData(trainingRef, { idField: 'id' }) as Observable<Training[]>;
  }

  async getTrainingById(id: string): Promise<Training | undefined> {
    try {
      const trainingSnap = await getDoc(doc(this.firestore, 'trainings', id));
      if (trainingSnap.exists()) {
        // Extraemos los datos y le inyectamos manualmente el ID del snapshot
        return { id: trainingSnap.id, ...trainingSnap.data() } as Training;
      } else {
        console.error(`No se encontró el entrenamiento con id: ${id}`);
        return undefined;
      }
    } catch (error) {
      console.error('Error al obtener el entrenamiento:', error);
      throw error;
    }
  }

  async updateTraining(id: string, data: Partial<Omit<Training, 'id'>>): Promise<void> {
    try {
      // Buscamos la referencia del documento en la colección de entrenamientos para actualizarlo directamente
      const trainingRef = doc(this.firestore, 'trainings', id);
      await updateDoc(trainingRef, data);
      console.log(`Entrenamiento actualizado.`);
    } catch (error) {
      console.error('Error al intentar actualizar el entrenamiento', error);
      throw error;
    }
  }

  async deleteTraining(id: string): Promise<void> {
    try {
      // Buscamos la referencia del documento en la colección de entrenamientos para borrarlo directamente
      await deleteDoc(doc(this.firestore, 'trainings', id));
      console.log(`Entrenamiento borrado.`);
    } catch (error) {
      console.error('Error al intentar borrar el entrenamiento', error);
      throw error;
    }
  }
}
