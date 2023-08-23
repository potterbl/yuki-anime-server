import {Body, Controller, Get, Header, Patch, Post, Put} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {RegistrationAuthDto} from "./dto/registration-auth.dto";
import {LoginAuthDto} from "./dto/login-auth.dto";

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
    getMe(@Body('token') token: string): Promise<object> {
        return this.authService.getMe(token)
    }

    @Patch('/updateHistory')
    updateHistory(@Body('token') token, @Body('animeId') animeId, @Body('season') season, @Body('episode') episode): Promise<{token: string}> {
        return this.authService.updateHistory(token, animeId, season, episode)
    }

}
