## Running the app

```
# instalar dependencias
npm install

# levantar docker para la bd(o mysql con el clon de la db)
docker compose up -d

# copiar y rellenar .env con credenciales de la db,etc
cp .env.example .env

# correr modo desarrollo
npm run dev

```

# run linter
```
npm run lint
```

# fix lint issues
```
npm run lint:fix
```
