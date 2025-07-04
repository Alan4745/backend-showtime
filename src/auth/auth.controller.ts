import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { GoogleAuthGuard } from './guards/google/auth/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post()
    async authValidate(@Body() login: RegisterDTO) {
        return await this.authService.validateOrCreateUser(login);
    }
    @Post('/login')
    async authLogin(@Body() login: LoginDTO) {
        return await this.authService.login(login);
    }
    @Post('/google')
    async googleAuth(@Body() body: { id_token: string }) {
        return await this.authService.googleLogin(body.id_token);
    }
    @Post('/apple')
    async appleAuth(@Body() body: { id_token: string }) {
        return await this.authService.appleLogin(body.id_token);
    }
    @UseGuards(GoogleAuthGuard)
    @Get('/google/login')
    async googleLoginAuth() {
    }
    @UseGuards(GoogleAuthGuard)
    @Get('/google/callback')
    async googleAuthCallBack(@Req() req) {
        return await this.authService.validateGoogleUser(req.user);
    }
    @Post('/register')
    async authRegister(@Body() register: RegisterDTO) {
        return await this.authService.register(register);
    }
}
