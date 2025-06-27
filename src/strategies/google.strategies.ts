import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport"
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly authService: AuthService) {
        super({
            clientID: process.env.CLIENT_ID || '',
            clientSecret: process.env.SECRET_CLIENT || '',
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',

            scope: ["email", "profile"]
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
        const user = {
            email: profile.emails[0].value,
            name: profile.name.givenName,
            method: 'google',
            password: '', // o null
        };
        done(null, user);
    }
}