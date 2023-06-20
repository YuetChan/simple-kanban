import { Controller, Get, Req, Res, UseGuards, } from "@nestjs/common";

import { JwtAuthService, LoginType } from "../jwt/jwt-auth.service";
import { GoogleOauthGuard } from "./google-oauth.guard";

@Controller("oauth/google-oauth")
export class GoogleOauthController {

    constructor(private jwtAuthSvc: JwtAuthService) { }

    @Get()
    @UseGuards(GoogleOauthGuard)
    async googleAuth(@Req() req) { }

    @Get("redirect")
    @UseGuards(GoogleOauthGuard)
    async googleAuthRedirect(@Req() req, @Res() res) { 
        const jwt = await this.jwtAuthSvc.getJwt(req.user, LoginType.GOOGLE);

        // Construct the URL with the query parameter
        const redirectUrl = new URL(process.env.UI_URL);
        redirectUrl.searchParams.append("jwt", jwt);
    
        // Redirect to the URL
        res.redirect(302, redirectUrl.toString());
    }
}
