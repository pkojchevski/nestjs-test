import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';

export class FallbackExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    return response.status(500).json({
      statusCode: 500,
      createdBy: ' FallbackExceptionFilter',
      errrorMessage: exception.message
        ? exception.message
        : 'Unexpected error occurred',
    });
  }
}
