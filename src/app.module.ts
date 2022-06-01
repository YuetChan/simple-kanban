
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleOauthModule } from './core/authentication/google-oauth/google-oauth.module';
import { JwtAuthModule } from './core/authentication/jwt/jwt-auth.module';
import { RegistrationModule } from './registration/registration.module';
import { JwtAuthMiddleware } from './core/filter/jwt-auth.middleware';
import { FilterModule } from './core/filter/filter.module';
import { RequestController } from './abac/request/request.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    GoogleOauthModule,
    JwtAuthModule,
    FilterModule,

    RegistrationModule
  ],
  controllers: [
    AppController,
    RequestController
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware).forRoutes(
        { path: 'requests', method: RequestMethod.POST },
      )
  }

}
