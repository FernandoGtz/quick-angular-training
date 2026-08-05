import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Importaciones de metodos modulares de firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA48BQ2n_ShqUZsEaW6lq5dtfHZG7PP5ZY',
  authDomain: 'gym-bmg-system.firebaseapp.com',
  projectId: 'gym-bmg-system',
  storageBucket: 'gym-bmg-system.firebasestorage.app',
  messagingSenderId: '290738974296',
  appId: '1:290738974296:web:e090c6923143793a9d242d',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Inicializamos la app de Firebase
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    // Inicializamos el servicio de Firestore
    provideFirestore(() => getFirestore()),
    // Inicializamos el servicio de autenticacion de firebase
    provideAuth(() => getAuth()),
  ],
};
