import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { RegistrationModule } from '../../../registration/registration.module';

import { JwtAuthService } from './jwt-auth.service';

@Module({
    imports: [
        RegistrationModule,
        JwtModule.registerAsync({
            imports: [ ConfigModule ],
            useFactory: async (configSvc: ConfigService) => {
                return {
                    secret: process.env.JWT_SECRET,
                    signOptions: { expiresIn: "604800s" },
                }
            },

            inject: [ ConfigService ],
        })
    ],
    providers: [ JwtAuthService ],
    exports: [ JwtModule, JwtAuthService ]
})
export class JwtAuthModule {}
