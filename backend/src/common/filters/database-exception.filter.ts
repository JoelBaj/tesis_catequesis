import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const error = exception as any;

    this.logger.error(
      `Database error: ${error?.message || 'Unknown error'}`,
      error?.stack,
    );

    // Errores de duplicado (MySQL errno 1062)
    if (error.errno === 1062 || error.code === 'ER_DUP_ENTRY') {
      const message = error.sqlMessage || error.message || '';
      let userMessage = 'El registro ya existe en el sistema';

      // Buscar en el mensaje qué campo es duplicado
      if (message.includes("key 'IDX_fa1376321185575cf2226b1491'") || message.toLowerCase().includes('name')) {
        userMessage = 'El país con ese nombre ya existe';
      } else if (message.includes("key 'IDX_") && message.toLowerCase().includes('code')) {
        userMessage = 'El código de país ya existe';
      } else if (message.includes('Duplicate entry')) {
        // Si solo dice duplicate entry, intenta extraer el valor
        const match = message.match(/Duplicate entry '([^']+)'/);
        if (match) {
          userMessage = `Ya existe un registro con el valor: ${match[1]}`;
        }
      }

      return response.status(400).json({
        statusCode: 400,
        message: userMessage,
      });
    }

    // Para otros errores de base de datos, retornar 500
    response.status(500).json({
      statusCode: 500,
      message: 'Error en la base de datos',
    });
  }
}
