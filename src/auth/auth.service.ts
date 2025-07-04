import { Injectable } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './auth.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import * as jwksClient from 'jwks-rsa';
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
            'auth.email': login.email
        })
        if (!findUser) {
            return {
                message: 'Usuario no encontrado.',
                status: false,
            }
        }

        if (findUser.auth.method == 'email') {
            if (!findUser.auth || !findUser.auth.passwordHash) {
                return {
                    message: "No password set for this user.",
                    status: false,
                }
            }
            const isMatch = await bcrypt.compare(login.password, findUser.auth.passwordHash.toString());
            if (!isMatch) {
                return {
                    message: "The password is incorrect.",
                    status: false,
                }
            }
        }

        const payload = {
            _id: findUser._id,
            name: findUser.name,
            email: findUser.auth.email,
            createdAt: findUser.createdAt,
        }

        const secretKey = this.configService.get<string>('JWT_SECRET') || '';
        const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });

        return {
            token: token,
            message: `Bienvenido ${findUser.name}! Ya formas parte de nuestra comunidad.`
        }
    }

    async googleLogin(idToken: string) {
        // Configuración de tu dominio de Auth0
        const AUTH0_DOMAIN = this.configService.get<string>('DOMINIO_AUTH0');

        // Obtener clave pública
        const client = jwksClient({
            jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
        });

        function getKey(header, callback) {
            client.getSigningKey(header.kid, (err, key: any) => {
                const signingKey = key.getPublicKey();
                callback(null, signingKey);
            });
        }

        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(idToken, getKey, {
                audience: 'TU_CLIENT_ID_AUTH0', // este es el Client ID de Auth0
                issuer: `https://${AUTH0_DOMAIN}/`,
                algorithms: ['RS256']
            }, (err, decoded) => {
                if (err) return reject(err);
                resolve(decoded);
            });
        });

        const { email, sub, name } = decoded as any;

        // Buscar usuario en DB
        let user = await this.usersModel.findOne({ providerId: sub });

        if (!user) {
            user = new this.usersModel({
                name,
                auth: {
                    email,
                    providerId: sub,
                    method: 'google'
                },
            });
            await user.save();
        }

        const payload = {
            _id: user._id,
            name: user.name,
            email: user.auth.email,
            createdAt: user.createdAt,
        }

        const secretKey = this.configService.get<string>('JWT_SECRET') || '';
        const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });

        return {
            token,
            message: `Bienvenido ${user.name}! Ya formas parte de nuestra comunidad.`,
        };
    }

    async appleLogin(idToken: string) {
        const AUTH0_DOMAIN = this.configService.get<string>('DOMINIO_AUTH0');
        const AUTH0_CLIENT_ID = 'CLIENT_ID_DE_TU_APP';

        const client = jwksClient({
            jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
        });

        function getKey(header, callback) {
            client.getSigningKey(header.kid, (err, key: any) => {
                const signingKey = key.getPublicKey();
                callback(null, signingKey);
            });
        }

        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(idToken, getKey, {
                audience: AUTH0_CLIENT_ID,
                issuer: `https://${AUTH0_DOMAIN}/`,
                algorithms: ['RS256']
            }, (err, decoded) => {
                if (err) return reject(err);
                resolve(decoded);
            });
        });

        const { email, sub: providerId, name } = decoded as any;

        // Buscar o crear el usuario
        let user = await this.usersModel.findOne({ providerId });
        if (!user) {
            user = new this.usersModel({
                name: name || 'Apple User',
                auth: {
                    email,
                    providerId,
                    method: 'apple'
                },
            });
            await user.save();
        }

        const payload = {
            _id: user._id,
            name: user.name,
            email: user.auth.email,
            createdAt: user.createdAt,
        }

        const secretKey = this.configService.get<string>('JWT_SECRET') || '';
        const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });

        return {
            token,
            message: `Bienvenido ${user.name}! Ya formas parte de nuestra comunidad.`,
        };
    }

    async validateGoogleUser(googleUser: RegisterDTO) {
        try {
            const user = await this.usersModel.findOne({ 'auth.email': googleUser.email })

            if (user) {
                return await this.login(googleUser);
            } else {
                return await this.register(googleUser);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async register(register: RegisterDTO) {
        const existingUser = await this.usersModel.findOne({ 'auth.email': register.email });

        if (existingUser) {
            return {
                message: "The email is already in use",
                status: false,
            }
        }

        const passwordHash = register.method == 'email' ? await bcrypt.hash(register.password, 10) : '';

        const userData = {
            name: register.name,
            auth: {
                email: register.email,
                method: register.method,
                passwordHash,
            },
            profile: {
                username: register.username,
                gender: register.gender,
                age: register.age,
                citizenship: register.citizenship,
                physical: {
                    weightKg: register.weightKg,
                    heightCm: register.heightCm,
                    goal: register.goal,
                },
                soccer: {
                    position: register.position,
                    experienceLevel: register.experienceLevel,
                    trainingFrequency: register.trainingFrequency,
                    dominantFoot: register.dominantFoot,
                },
                preferences: {
                    contentLikes: register.contentLikes,
                    notificationsEnabled: register.notificationsEnabled,
                }
            },
            meta: {
                isActive: register.isActive,
                lastLogin: register.lastLogin,
                registeredAt: new Date()
            },
            plan: {
                type: register.type,
                price: register.price,
                activatedAt: new Date()
            }
        };

        // Limpia los campos undefined
        function clean(obj: any): any {
            if (obj && typeof obj === 'object') {
                Object.keys(obj).forEach(key => {
                    const value = obj[key];
                    if (
                        value === undefined ||
                        (typeof value === 'object' && clean(value) && Object.keys(value).length === 0)
                    ) {
                        delete obj[key];
                    }
                });
            }
            return obj;
        }

        const newUser = new this.usersModel(clean(userData));
        await newUser.save();

        const payload = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.auth.email,
            createdAt: newUser.createdAt,
        }
        const secretKey = this.configService.get<string>('JWT_SECRET') || '';
        const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });

        return {
            token: token,
            message: `Bienvenido ${newUser.name}! Ya formas parte de nuestra comunidad.`
        }
    }


    async validateOrCreateUser(data: RegisterDTO) {
        let user = await this.usersModel.findOne({ 'auth.email': data.email });

        if (user) {
            return await this.login({
                email: data.email,
                password: data.password
            })
        } else {
            return await this.register(data);
        }
    }
}
