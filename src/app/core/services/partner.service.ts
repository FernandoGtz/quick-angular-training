import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Partner } from '../models/partner.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  // Inyectamos la base de datos
  private firestore: Firestore = inject(Firestore);

  // Operacion Create
  async createPartner(partner: Omit<Partner, 'id'>): Promise<string> {
    try {
      // Se crea una referencia de la coleccion donde vamos a guardar el partner
      const collectionRef = collection(this.firestore, 'partners');

      // Se añade un nuevo documento formado por el modelo partner dentro de su respectiva coleccion
      const documentRef = await addDoc(collectionRef, partner);

      // Retornamos el id que sea para el documento
      return documentRef.id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Operacion Read
  getPartners(): Observable<Partner[]> {
    const collectionRef = collection(this.firestore, 'partners');
    return collectionData(collectionRef, {idField: 'id'}) as Observable<Partner[]>;
  }
}
