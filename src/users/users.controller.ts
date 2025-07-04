import { Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/middleware/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) {

    }

    @Get()
    async getUsers() {
        return await this.userService.getAllUsers();
    }

    @UseGuards(AuthGuard)
    @Get('/me')
    async getMeUsers(@Req() req: Request) {
        return await this.userService.getMeUsers(req['user']._id);
    }
    @UseGuards(AuthGuard)
    @Post('/me')
    async saveInfoUser(@Req() req: Request) {
        return await this.userService.getMeUsers(req['user']._id);
    }

    @UseGuards(AuthGuard)
    @Put('/me')
    async updateInfoUser(@Req() req: Request) {
        return await this.userService.updateMeUser(req['user']._id, req.body);
    }
}
