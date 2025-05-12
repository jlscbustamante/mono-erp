import { loadGlobalEnv } from "@scope/shared/env";

await loadGlobalEnv();

// AQUI VA CODIGO QUE SE QUIERA PROBAR SIN TENER QUE LEVANTAR EL SERVIDOR HONO

/**
 * Checks if the .erp directory exists in the home directory and creates it if it doesn't.
 * @returns true if the directory exists or was created, false otherwise
 * @throws Error if there was a problem creating the directory
 */
