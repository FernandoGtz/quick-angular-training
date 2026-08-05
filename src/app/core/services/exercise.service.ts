import { inject, Injectable } from '@angular/core';
import { query, where, getDocs, addDoc, deleteDoc, doc, collection, collectionData, Firestore, getDoc, updateDoc } from '@angular/fire/firestore';
import { catchError, Observable } from 'rxjs';
import { Exercise } from '../models/exercise.model';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private firestore = inject(Firestore);

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

  getExercises(): Observable<Exercise[]> {
    const exerciseRef = collection(this.firestore, 'exercises');
    const q = query(exerciseRef, where('isActive', '==', true));
    return collectionData(q, { idField: 'id' }) as Observable<Exercise[]>;
  }

  async getExerciseById(id: string): Promise<Exercise | undefined> {
    try {
      const exerciseSnap = await getDoc(doc(this.firestore, 'exercises', id));
      if (exerciseSnap.exists()) {
        return { id: exerciseSnap.id, ...exerciseSnap.data() } as Exercise;
      } else {
        console.error(`No se encontró el ejercicio con id: ${id}`);
        return undefined;
      }
    } catch (error) {
      console.error('Error al obtener el ejercicio:', error);
      throw error;
    }
  }

  async updateExercise(id: string, data: Partial<Omit<Exercise, 'id' | 'isActive'>>): Promise<void> {
    try {
      const exerciseRef = doc(this.firestore, 'exercises', id);
      await updateDoc(exerciseRef, data);
      console.log(`Ejercicio actualizado.`);
    } catch (error) {
      console.error('Error al actualizar el ejercicio:', error);
      throw error;
    }
  }

  async deleteExercise(id: string): Promise<void> {
    try {
      // Buscamos la referencia del documento en la colección de entrenamientos
      const trainingRef = collection(this.firestore, 'trainings');

      // Construimos  y ejecutamos la query
      const q = query(trainingRef, where('exercisesIds', 'array-contains', id));
      const querySnapshot = await getDocs(q);

      // Buscamos la referencia de los documentos que queremos modificar
      const exerciseRef = doc(this.firestore, 'exercises', id);

      if (querySnapshot.empty) {
        // Si no hay entrenamientos que contengan el ejercicio, eliminamos el documento
        await deleteDoc(exerciseRef);
        console.log(exerciseRef, "Fue borrado correctamente");
      } else {
        // Realizamos un soft delete si hay entrenamientos que contienen el ejercicio
        await updateDoc(exerciseRef, { isActive: false });
      }
    } catch (error) {
      console.error("Error al intentar borrar jeje", error);
      throw error;
    }
  }
}
