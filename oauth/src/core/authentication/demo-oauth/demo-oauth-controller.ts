import { Controller, Post, Req, Res } from "@nestjs/common";

import { JwtAuthService, LoginType } from "../jwt/jwt-auth.service";

@Controller("oauth/demo-oauth")
export class DemoOauthController {

    constructor(private jwtAuthSvc: JwtAuthService) { }

    @Post("")
    async demoAuth(@Req() req, @Res() res) { 
        const user  = {
            name: req.body.username,
            email: `${ req.body.username }@simplekanban.yuetchan.us`
        }

        const jwt = await this.jwtAuthSvc.getJwt(user, LoginType.GOOGLE);

        res.status(201).json({ 
            jwt: jwt
        });
    }
}