import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

// Importaciones de metodos modulares de firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'tu-project-id',
        appId: 'tu-app-id',
        storageBucket: 'tu-bucket',
        apiKey: 'tu-api-key',
        authDomain: 'tu-domain',
        messagingSenderId: 'tu-sender-id',
      }),
    ),

    // Inyección de Firestore
    provideFirestore(() => getFirestore()),

    // Inyección de Autenticación
    provideAuth(() => getAuth()),
  ],
};
