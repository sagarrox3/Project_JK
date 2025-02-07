import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseContent = exception.getResponse();
      message =
        typeof responseContent === 'string'
          ? responseContent
          : (responseContent as any)?.message || message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      code: false,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
