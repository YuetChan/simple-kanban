import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";

import { JwtAuthService, LoginType } from "../jwt/jwt-auth.service";
import { GoogleOauthGuard } from "./google-oauth.guard";

@Controller("oauth/google-oauth")
export class GoogleOauthController {

    constructor(private jwtAuthSvc: JwtAuthService) { }

    @Get()
    @UseGuards(GoogleOauthGuard)
    async googleAuth(@Req() req) { 
        return req; 
    }

    @Get("redirect")
    @UseGuards(GoogleOauthGuard)
    async googleAuthRedirect(@Req() req, @Res() res) { 
        res.cookie("jwt", await this.jwtAuthSvc.getJwt(req.user, LoginType.GOOGLE));
        res.redirect(302, `${process.env.UI_HOST}`);
    }
}
