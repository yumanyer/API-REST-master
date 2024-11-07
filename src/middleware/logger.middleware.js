// logger.middleware.js
import winstonLogger from '../utils/logger.util.js';

const loggerMiddleware = (req, res, next) => {
  winstonLogger.http(`Solicitud HTTP: ${req.method} ${req.originalUrl}`);
  next();
};

// Middleware para manejar errores
const errorLoggerMiddleware = (err, req, res, next) => {
  winstonLogger.error(`Error: ${err.message} - Ruta: ${req.originalUrl}`);
  next(err); // Pasa el error al siguiente middleware de manejo de errores
};

export { loggerMiddleware, errorLoggerMiddleware };
