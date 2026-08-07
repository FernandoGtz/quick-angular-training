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

  getAllExercises(): Observable<Exercise[]> {
    const exerciseRef = collection(this.firestore, 'exercises');
    return collectionData(exerciseRef, { idField: 'id' }) as Observable<Exercise[]>;
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

  async changeExerciseState(id: string, state: boolean): Promise<void> {
    try {
      // Preparamos la referencia al documento
      const exerciseRef = doc(this.firestore, 'exercises', id);

      // Ejecutamos la mutación directa sobre el campo booleano.
      await updateDoc(exerciseRef, { isActive: state });
    } catch (error) {
      console.error('Error al cambiar estado del ejercicio:', error);
      throw error;
    }
  }

  async deleteExercise(id: string): Promise<void> {
    try {
      // Buscamos la referencia de los documentos que queremos modificar
      const exerciseRef = doc(this.firestore, 'exercises', id);
      await deleteDoc(exerciseRef);
      console.log(exerciseRef, "Fue borrado correctamente");
    } catch (error) {
      console.error("Error al intentar borrar jeje", error);
      throw error;
    }
  }

  async checkExerciseDependencies(exerciseId: string): Promise<boolean> {
    // Referencia a la colección de entrenamientos
    const trainingsRef = collection(this.firestore, 'trainings');

    // Consulta y ejecucion de consulta para buscar dependencias
    const q = query(trainingsRef, where('exercisesIds', 'array-contains', exerciseId));
    const querySnapshot = await getDocs(q);

    // Si no hay documentos relacionados se retorna un false
    return !querySnapshot.empty;
  }

  async processExerciseDeletion(id: string): Promise<string> {
    // Se prepara la referencia al documento específico que vamos a afectar
    const exerciseRef = doc(this.firestore, 'exercises', id);

    // Consultamos si el ejercicio está en uso esperando la promesa
    const hasDependencies = await this.checkExerciseDependencies(id);

    if (hasDependencies) {
      // Se aplica un soft delete
      await this.changeExerciseState(id, false);
      return 'SOFT_DELETE';
    } else {
      // Se ejecuta un hard delete
      await this.deleteExercise(id);
      return 'HARD_DELETE';
    }
  }
}
