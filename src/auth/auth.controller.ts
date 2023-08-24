import {Body, Controller, Get, Header, Patch, Post, Put} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {RegistrationAuthDto} from "./dto/registration-auth.dto";
import {LoginAuthDto} from "./dto/login-auth.dto";
import * as jwt from "jsonwebtoken";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @Post('/login')
    login(@Body() loginDto: LoginAuthDto): Promise<{token: string}>{
        return this.authService.login(loginDto)
    }

    @Post('/registration')
    registration (@Body() registrationDto: RegistrationAuthDto): Promise<{token: string}>{
        return this.authService.registration(registrationDto)
    }

    @Post('/getMe')
    getMe(@Body('token') token: string): Promise<string | jwt.JwtPayload> {
        return this.authService.getMe(token)
    }

    @Patch('/updateHistory')
    updateHistory(@Body('token') token, @Body('animeId') animeId, @Body('season') season, @Body('episode') episode): Promise<{token: string}> {
        return this.authService.updateHistory(token, animeId, season, episode)
    }

    @Post('/sendReset')
    resetMailSend(@Body('email') email): Promise<{message: string}>{
        return this.authService.resetMailSend(email)
    }

    @Post('/reset')
    reset(@Body('token') token, @Body('password') password): Promise<{token: string}>{
        return this.authService.resetPassword(token, password)
    }

}
