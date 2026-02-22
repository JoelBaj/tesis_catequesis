if (process.env.NODE_ENV !== 'production') {
  try {
    // Permite cargar archivos .ts en runtime para TypeORM en desarrollo
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('ts-node/register');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('tsconfig-paths/register');
  } catch {
    // Ignorar si no están disponibles (por ejemplo, en producción)
  }
}
