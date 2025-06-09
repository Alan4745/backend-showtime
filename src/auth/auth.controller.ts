import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './auth.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {

    }

    @Post('/login')
    async authLogin(@Body() login: LoginDTO) {
        return await this.authService.login(login);
    }

    @Post('/register')
    async authRegister(@Body() register: RegisterDTO) {
        return await this.authService.register(register);
    }
}
