# GymCrud

Proyecto rápido desarrollado para poner en práctica el framework **Angular 18** mediante un CRUD completo de un gimnasio. La persistencia de datos se realiza con **Firebase Firestore** y la autenticación de usuarios con **Firebase Auth**.

El proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli).

## Características

- **Angular 18** con componentes *standalone* y señales (`signal`, `computed`).
- **CRUD** de tres entidades: Entrenamientos, Socios y Ejercicios.
- **Firebase Firestore** como base de datos (persistencia en tiempo real).
- **Firebase Auth** para el registro, inicio y cierre de sesión.
- Guard de rutas que protege el acceso a la aplicación si no hay sesión activa.
- Soft delete para ejercicios en uso y eliminación definitiva para el resto.
- Estilos con **Tailwind CSS** y *toasts* para notificar el resultado de las acciones.
- Formularios reactivos con validación.

## Requisitos previos

- Node.js y npm instalados.
- Un proyecto de Firebase con **Authentication** y **Firestore** habilitados.
- Las credenciales de Firebase configuradas en `src/app/app.config.ts`.

## Servidor de desarrollo

Para iniciar el servidor de desarrollo local, ejecuta:

```bash
ng serve
```

Una vez en marcha, abre el navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cuando modifiques cualquier archivo fuente.

## Generación de código

Angular CLI incluye potentes herramientas de *scaffolding*. Para generar un nuevo componente, ejecuta:

```bash
ng generate component nombre-componente
```

Para ver la lista completa de esquemas disponibles (como `components`, `directives` o `pipes`), ejecuta:

```bash
ng generate --help
```

## Compilación

Para compilar el proyecto, ejecuta:

```bash
ng build
```

Esto compilará tu proyecto y guardará los artefactos generados en el directorio `dist/`. Por defecto, la compilación de producción optimiza la aplicación en cuanto a rendimiento y velocidad.

## Tests

Actualmente el proyecto no incluye un runner de tests configurado (solo existe el `spec` por defecto de Angular). Si se desea, se puede ejecutar:

```bash
ng test
```

## Estructura del proyecto

```
src/app/
├── core/                  # Modelos, servicios, guards y pipes reutilizables
│   ├── guards/            # auth.guard: protección de rutas
│   ├── models/            # Interfaces de Exercise, Partner y Training
│   ├── pipes/             # gender.pipe: traducción del género
│   └── services/          # Auth, Firestore (CRUD) y Toast
├── features/              # Funcionalidades por módulo (login, sign-up, partners, trainings, exercises)
└── layout/                # Componentes de estructura (dashboard, toast, filter-bar, confirm-modal)
```

## Recursos adicionales

Para más información sobre el uso de Angular CLI, incluyendo referencias detalladas de comandos, visita la página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
