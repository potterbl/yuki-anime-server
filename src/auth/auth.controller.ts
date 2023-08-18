import {Body, Controller, Get, Header, Patch, Post, Put} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {RegistrationAuthDto} from "./dto/registration-auth.dto";
import {LoginAuthDto} from "./dto/login-auth.dto";
import e from "express";
import {historyType} from "./schemas/account.schema";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @Post('/login')
    login(@Body() loginDto: LoginAuthDto): Promise<string> {
        return this.authService.login(loginDto)
    }

    @Post('/registration')
    registration (@Body() registrationDto: RegistrationAuthDto): Promise<string> {
        return this.authService.registration(registrationDto)
    }

    @Post('/getMe')
    getMe(@Body('token') token: string): Promise<object> {
        return this.authService.getMe(token)
    }

    @Put('/update')
    update(@Body() accountDto: RegistrationAuthDto, @Body('token') token: string): Promise<string> {
        return this.authService.update(token, accountDto)
    }

    @Patch('/updateHistory')
    updateHistory(@Body('token') token, @Body('animeId') animeId, @Body('season') season, @Body('episode') episode) {
        return this.authService.updateHistory(token, animeId, season, episode)
    }

}
