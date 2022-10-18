import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './rest-api/auth/auth.controller';
import { AuthModule } from './rest-api/auth/auth.module';
import { EncryptController } from './rest-api/encrypt/encrypt.controller';
import { EncryptModule } from './rest-api/encrypt/encrypt.module';
import { GetUserMiddleware } from './rest-api/middleware/get-user.middleware';

@Module({
  imports: [AuthModule, EncryptModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(GetUserMiddleware)
      .forRoutes(AuthController, EncryptController);
  }
}
