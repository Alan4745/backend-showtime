import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO, RegisterDTO } from './auth.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from 'src/schemas/users.schema';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel('Users') private usersModel: Model<Users>,
        // private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {

    }

    async login(login: LoginDTO) {
        const findUser = await this.usersModel.findOne({
            email: login.email
        })

        if (!findUser) {
            return {
                message: 'Usuario no encontrado.',
                status: false,
            }
        }

        const isMatch = await bcrypt.compare(login.password, findUser.password.toString());
        if (!isMatch) {
            return {
                message: "The password is incorrect.",
                status: false,
            }
        }

        const payload = {
            _id: findUser._id,
            name: findUser.name,
            email: findUser.email,
            createdAt: findUser.createdAt,
        }

        const secretKey = this.configService.get<string>('JWT_SECRET') || '';
        const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });

        return {
            token: token,
            message: `Bienvenido ${findUser.name}`
        }
    }

    async register(register: RegisterDTO) {
        const existingUser = await this.usersModel.findOne({ email: register.email });

        if (existingUser) {
            return {
                message: "The email is already in use",
                status: false,
            }
        }

        const passwordHash = await bcrypt.hash(register.password, 10);

        const newUsers = new this.usersModel({
            name: register.name,
            email: register.email,
            password: passwordHash
        })

        newUsers.save();

        const payload = {
            _id: newUsers._id,
            name: newUsers.name,
            email: newUsers.email,
            createdAt: newUsers.createdAt,
        }
        const secretKey = this.configService.get<string>('JWT_SECRET') || '';
        const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });

        return {
            token: token,
            message: `Bienvenido ${newUsers.name}`
        }
    }
}
