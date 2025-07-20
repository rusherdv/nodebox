module.exports = {
  apps: [
    {
      name: "nodebox", // Nombre del proceso
      script: "server.js", // Archivo principal del servidor
      instances: 1, // Número de instancias (puedes usar "max" para usar todos los núcleos disponibles)
      autorestart: true, // Reiniciar si el proceso falla
      watch: false, // Si deseas monitorear cambios en el código y reiniciar automáticamente
      max_memory_restart: "1G", // Reiniciar si el proceso usa más de 1 GB de RAM
      env: {
        NODE_ENV: "development", // Variables de entorno para desarrollo
        PORT: 2498,
      },
      env_production: {
        NODE_ENV: "production", // Variables de entorno para producción
        PORT: 2498,
      },
    },
  ],
};
