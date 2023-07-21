import { Module } from "@nestjs/common";
import { JwtAuthModule } from "../jwt/jwt-auth.module";
import { DemoOauthController } from "./demo-oauth-controller";

@Module({
    imports: [ JwtAuthModule ],
    providers: [ ],
    controllers: [ DemoOauthController ],
})
export class DemoOauthModule { }