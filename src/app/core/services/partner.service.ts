import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, getDocs, doc, deleteDoc, where, collectionData, getDoc, updateDoc } from '@angular/fire/firestore';
import { Partner } from '../models/partner.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  // Inyectamos la base de datos
  private firestore: Firestore = inject(Firestore);

  // Operacion Create
  async createPartner(partner: Omit<Partner, 'id' | 'isActive'>): Promise<string> {
    try {
      // Se crea una referencia de la coleccion donde vamos a guardar el partner
      const collectionRef = collection(this.firestore, 'partners');
      const payload = { ...partner, isActive: true };

      // Retornamos el id que sea para el documento
      const documentRef = await addDoc(collectionRef, payload);
      return documentRef.id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Operacion Read
  getPartners(): Observable<Partner[]> {
    const collectionRef = collection(this.firestore, 'partners');
    const q = query(collectionRef, where('isActive', '==', true));
    return collectionData(q, { idField: 'id' }) as Observable<Partner[]>;
  }

  async getPartnerById(id: string): Promise<Partner | undefined> {
    try {
      const partnerSnap = await getDoc(doc(this.firestore, 'partners', id));
      if (partnerSnap.exists()) {
        // Extraemos los datos y le inyectamos manualmente el ID del snapshot
        return { id: partnerSnap.id, ...partnerSnap.data() } as Partner;
      } else {
        console.error(`No se encontró el socio con id: ${id}`);
        return undefined;
      }
    } catch (error) {
      console.error('Error al obtener el socio:', error);
      throw error;
    }
  }

  async updatePartner(id: string, data: Partial<Omit<Partner, 'id' | 'isActive'>>): Promise<void> {
    try {
      // Buscamos la referencia del documento en la colección de partners para actualizarlo directamente
      const partnerRef = doc(this.firestore, 'partners', id);
      await updateDoc(partnerRef, data);
      console.log(`Socio actualizado.`);
    } catch (error) {
      console.error('Error al intentar actualizar el socio', error);
      throw error;
    }
  }

  async deletePartner(id: string): Promise<'DELETED' | 'BLOCKED'> {
    try {
      // Obtenemos la referencia de la coleccion
      const trainingRef = collection(this.firestore, 'trainings');
      // Creamos y ejecutamos la query
      const q = query(trainingRef, where('partnerId', '==', id));
      const querySnapshot = await getDocs(q);
      // Obtenemos la referencia del documento
      const partnerRef = doc(this.firestore, 'partners', id);

      if (querySnapshot.empty) {
        // Si no hay un entrenamiento asociado realizamos un hard delete
        await deleteDoc(partnerRef);
        return 'DELETED';
      } else {
        // Si los hay, bloqueamos la operacion
        return 'BLOCKED';
      }
    } catch (error) {
      console.error('Error al intentar borrar al socio', error);
      throw error;
    }
  }
}
