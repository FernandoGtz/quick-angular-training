import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/*
 * Application entry point.
 * Bootstraps the standalone App component using the global
 * application configuration (router, Firebase app, Firestore and Auth).
 * Any startup error is logged to the console.
 */
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
