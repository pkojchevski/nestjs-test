import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { FallbackExceptionFilter } from './rest-api/filters/fallback.filter';
import { HttpExceptionFilter } from './rest-api/filters/http.filter';
import { ValidationFilter } from './rest-api/filters/validation.filter';
import { ValidationException } from './rest-api/filters/validation.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.setGlobalPrefix('api');

  app.useGlobalFilters(
    new FallbackExceptionFilter(),
    new HttpExceptionFilter(),
    new ValidationFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map(
          (error) => `${error.property} has wrong value ${error.value},
                ${Object.values(error.constraints).join(', ')} `,
        );

        return new ValidationException(messages);
      },
    }),
  );

  await app.listen(9000);
}

bootstrap();
