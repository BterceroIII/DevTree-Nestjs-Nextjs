import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponseDto } from '../dto/api-response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | string[] = '';
    let title = '';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'object' && res !== null) {
        const responseObj = res as any;

        if (Array.isArray(responseObj.message)) {
          message = responseObj.message.map((err) => {
            if (
              err &&
              typeof err === 'object' &&
              err.constraints &&
              typeof err.constraints === 'object'
            ) {
              return Object.values(err.constraints).join(', ');
            }
            return err;
          });
        } else {
          message = responseObj.message;
        }
        title = responseObj.title || '';
      } else {
        message = typeof res === 'string' ? res : '';
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    this.logger.error(
      `HTTP status: ${status} Error message: ${message} Path: ${request.url}`,
      exception instanceof Error ? exception.stack : '',
    );

    console.log('Error message:', exception);

    const errorResponse = ApiResponseDto.Failure(
      Array.isArray(message) ? message.join(', ') : message,
      title,
    );

    response.status(status).json(errorResponse);
  }
}
