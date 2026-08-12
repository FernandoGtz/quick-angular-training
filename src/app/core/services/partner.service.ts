import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, getDocs, doc, deleteDoc, where, collectionData, getDoc, updateDoc } from '@angular/fire/firestore';
import { Partner } from '../models/partner.model';
import { Observable } from 'rxjs';

/*
 * Partner service.
 * Handles the CRUD operations over the 'partners' Firestore collection.
 * Deleting a partner is blocked when the partner still has associated
 * trainings, to keep the referential integrity of the data.
 */
@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  // Inject the Firestore database
  private firestore: Firestore = inject(Firestore);

  /*
   * Create operation.
   * Creates a new partner document with an active state and returns its id.
   */
  async createPartner(partner: Omit<Partner, 'id' | 'isActive'>): Promise<string> {
    try {
      // Create a reference to the collection where the partner will be stored
      const collectionRef = collection(this.firestore, 'partners');
      const payload = { ...partner, isActive: true };

      // Return the id assigned to the new document
      const documentRef = await addDoc(collectionRef, payload);
      return documentRef.id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /*
   * Read operation.
   * Returns an observable stream of active partners only.
   */
  getPartners(): Observable<Partner[]> {
    const collectionRef = collection(this.firestore, 'partners');
    const q = query(collectionRef, where('isActive', '==', true));
    return collectionData(q, { idField: 'id' }) as Observable<Partner[]>;
  }

  /*
   * Fetches a single partner document by its id.
   * Returns the partner data or undefined if the document does not exist.
   */
  async getPartnerById(id: string): Promise<Partner | undefined> {
    try {
      const partnerSnap = await getDoc(doc(this.firestore, 'partners', id));
      if (partnerSnap.exists()) {
        // Extract the data and inject the snapshot id manually
        return { id: partnerSnap.id, ...partnerSnap.data() } as Partner;
      } else {
        console.error(`Partner with id not found: ${id}`);
        return undefined;
      }
    } catch (error) {
      console.error('Error getting the partner:', error);
      throw error;
    }
  }

  /*
   * Partially updates an existing partner document.
   */
  async updatePartner(id: string, data: Partial<Omit<Partner, 'id' | 'isActive'>>): Promise<void> {
    try {
      // Look up the document reference in the partners collection to update it directly
      const partnerRef = doc(this.firestore, 'partners', id);
      await updateDoc(partnerRef, data);
      console.log(`Partner updated.`);
    } catch (error) {
      console.error('Error trying to update the partner', error);
      throw error;
    }
  }

  /*
   * Deletes a partner.
   * If the partner has no associated trainings it performs a hard delete
   * and returns false; otherwise the operation is blocked and returns true.
   */
  async deletePartner(id: string): Promise<boolean> {
    try {
      // Get the reference to the trainings collection
      const trainingRef = collection(this.firestore, 'trainings');
      // Create and run the query looking for trainings of this partner
      const q = query(trainingRef, where('partnerId', '==', id));
      const querySnapshot = await getDocs(q);
      // Get the reference to the partner document
      const partnerRef = doc(this.firestore, 'partners', id);

      if (querySnapshot.empty) {
        // If there is no associated training, perform a hard delete
        await deleteDoc(partnerRef);
        return false;
      } else {
        // If there are associated trainings, block the operation
        return true;
      }
    } catch (error) {
      console.error('Error trying to delete the partner', error);
      throw error;
    }
  }
}
