import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Meta, MetaSchema, Plan, PlanSchema } from "./plan.schema";
@Schema()
export class AuthData {
    @Prop({ required: true })
    method: 'email' | 'google' | 'apple';

    @Prop({ required: true })
    email: string;

    @Prop()
    passwordHash?: string;

    @Prop()
    providerId?: string;
}

const AuthDataSchema = SchemaFactory.createForClass(AuthData);

@Schema()
export class Preferences {
    @Prop()
    contentLikes: string[];

    @Prop()
    notificationsEnabled: boolean;
}

const PreferencesSchema = SchemaFactory.createForClass(Preferences);

@Schema()
export class Physical {
    @Prop()
    weightKg: number;

    @Prop()
    heightCm: number;

    @Prop({ required: true })
    goal: 'gain_muscle' | 'lose_fat' | 'maintain';
}

const PhysicalSchema = SchemaFactory.createForClass(Physical);

@Schema()
export class Soccer {
    @Prop()
    position: 'goalkeeper' | 'defender' | 'center_back' | 'fullback' | 'midfielder' | 'winger' | 'forward';

    @Prop()
    experienceLevel: 'high_school' | 'academy' | 'college' | 'semi_pro' | 'lower_division_pro';

    @Prop()
    trainingFrequency: '3_5_per_week' | '5_7_per_week' | 'more_than_7';

    @Prop()
    dominantFoot: string;
}

const SoccerSchema = SchemaFactory.createForClass(Soccer);

@Schema()
export class ProfileData extends Document {
    @Prop()
    username: string;

    @Prop({ required: true })
    gender: string;

    @Prop()
    age: number;

    @Prop()
    citizenship: string;
    @Prop()
    birthdate: string;
    @Prop()
    appDiscoverySource: string;

    @Prop({ type: PhysicalSchema })
    physical: Physical;

    @Prop({ type: SoccerSchema })
    soccer: Soccer;

    @Prop({ type: PreferencesSchema })
    preferences: Preferences;
}

const ProfileDataSchema = SchemaFactory.createForClass(ProfileData);

@Schema()
export class Users extends Document {
    @Prop({ type: AuthDataSchema, required: true })
    auth: AuthData;

    @Prop()
    name: string;

    @Prop({ type: ProfileDataSchema })
    profile: ProfileData;

    @Prop({ type: MetaSchema })
    meta: Meta;

    @Prop({ type: PlanSchema })
    plan: Plan;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users);