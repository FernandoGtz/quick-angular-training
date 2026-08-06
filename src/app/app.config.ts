import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Importaciones de metodos modulares de firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Inicializamos la app de Firebase
    provideFirebaseApp(() => initializeApp(var)),
    // Inicializamos el servicio de Firestore
    provideFirestore(() => getFirestore()),
    // Inicializamos el servicio de autenticacion de firebase
    provideAuth(() => getAuth()),
  ],
};
