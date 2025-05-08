# README para Mono-ERP

## Instalación

```bash
# Instalar dependencias
pnpm install
```

## Desarrollo

Para levantar el proyecto en modo desarrollo:

```bash
# Ejecutar todos los servicios simultáneamente
pnpm run dev

# O ejecutar servicios específicos
pnpm run dev:backend  # Levanta el backend
pnpm run dev:frontend # Levanta el frontend
pnpm run dev:views    # Levanta las vistas Deno
```

## Base de datos

Para construir la base de datos:

```bash
pnpm run dbbuild
```

## Estructura del proyecto

Este es un proyecto monorepo con la siguiente estructura:
- `apps`: Contiene las aplicaciones principales
  - `frontend/`: Aplicación React con TypeScript y Vite
  - `backend`: API y servicios principales
  - `assistance/`: Servicio de asistencia
- `packages`: Paquetes compartidos
  - `pizzadb/`: Cliente y modelos de base de datos
  - `shared/`: Utilidades compartidas

## Configuración

1. Copia el archivo de ejemplo de variables de entorno
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```

2. Configura las variables de entorno con las credenciales necesarias

3. Levanta Docker para la base de datos (o usa MySQL con un clon de la DB)
   ```bash
   cd apps/backend
   docker-compose up -d
   ```

## Scripts disponibles en `package.json`

- `dev`: Ejecuta todos los servicios en modo desarrollo
- `dev:backend`: Ejecuta solo el backend
- `dev:frontend`: Ejecuta solo el frontend
- `dev:views`: Ejecuta las vistas de Deno
- `dbbuild`: Construye los paquetes de la base de datos
- `test`: Ejecuta los tests (actualmente no configurado)

## Linting (en el backend)

```bash
cd apps/backend
pnpm run lint      # Verificar problemas
pnpm run lint:fix  # Corregir problemas automáticamente
```