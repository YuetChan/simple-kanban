import { Module } from "@nestjs/common";
import { JwtAuthModule } from "../authentication/jwt/jwt-auth.module";

@Module({  
	imports: [JwtAuthModule],
})
export class FilterModule { }