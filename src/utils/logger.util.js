import {createLogger, format, transports , addColors} from 'winston';

// Destructuro los formatos a usar 
const {colorize, combine, timestamp, printf,simple} = format;

// Niveles de log
const levels ={fatal:0, error:1, info:2, http:3, };

const colors = {fatal:'red', error:'yellow', info:'magenta', http:'green'};

// configuramos los colores de los niveles
addColors(colors);

// Función para definir el formato del log 
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
  });
  
  //  logger con los diferentes niveles de log y formatos
  const winstonLogger = createLogger({
    levels,
    format: format.combine(
      timestamp(),
      logFormat
    ),
    transports: [
      // Primer nivel: Registro HTTP en consola 
      new transports.Console({
        level: 'http',
        format: format.combine(
            colorize(), 
            simple()
        )
        
      }),
      // Segundo nivel: Registro de errores en archivo 
      new transports.File({
        level: 'error',
        filename: './src/utils/errors/error.log',
        format: combine(
            timestamp(),
            simple()  
          )
      })
    ]
  });
  
  export default winstonLogger;