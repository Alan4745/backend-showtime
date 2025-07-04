import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/schemas/users.schema';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel('Users') private usersModel: Model<Users>,
    ) {

    }

    async getAllUsers() {
        return await this.usersModel.find().exec()
    }

    async getMeUsers(_id: string) {
        return await this.usersModel
            .findById({ _id })
            .select('-auth.passwordHash')
            .exec()
    }

    async updateMeUser(_id: string, updateData: any) {
        // Construye el objeto de actualización respetando la estructura anidada
        const update: any = {};

        if (updateData.name) update.name = updateData.name;

        // Auth
        if (updateData.email || updateData.method) {
            update['auth'] = {};
            if (updateData.email) update['auth'].email = updateData.email;
            if (updateData.method) update['auth'].method = updateData.method;
        }

        // Profile
        if (
            updateData.username || updateData.gender || updateData.age ||
            updateData.citizenship || updateData.weightKg || updateData.heightCm ||
            updateData.goal || updateData.position || updateData.experienceLevel ||
            updateData.trainingFrequency || updateData.dominantFoot ||
            updateData.contentLikes || updateData.notificationsEnabled
        ) {
            update['profile'] = {};

            if (updateData.username) update['profile'].username = updateData.username;
            if (updateData.gender) update['profile'].gender = updateData.gender;
            if (updateData.age) update['profile'].age = updateData.age;
            if (updateData.citizenship) update['profile'].citizenship = updateData.citizenship;

            // Physical
            if (updateData.weightKg || updateData.heightCm || updateData.goal) {
                update['profile'].physical = {};
                if (updateData.weightKg) update['profile'].physical.weightKg = updateData.weightKg;
                if (updateData.heightCm) update['profile'].physical.heightCm = updateData.heightCm;
                if (updateData.goal) update['profile'].physical.goal = updateData.goal;
            }

            // Soccer
            if (updateData.position || updateData.experienceLevel || updateData.trainingFrequency || updateData.dominantFoot) {
                update['profile'].soccer = {};
                if (updateData.position) update['profile'].soccer.position = updateData.position;
                if (updateData.experienceLevel) update['profile'].soccer.experienceLevel = updateData.experienceLevel;
                if (updateData.trainingFrequency) update['profile'].soccer.trainingFrequency = updateData.trainingFrequency;
                if (updateData.dominantFoot) update['profile'].soccer.dominantFoot = updateData.dominantFoot;
            }

            // Preferences
            if (updateData.contentLikes || updateData.notificationsEnabled !== undefined) {
                update['profile'].preferences = {};
                if (updateData.contentLikes) update['profile'].preferences.contentLikes = updateData.contentLikes;
                if (updateData.notificationsEnabled !== undefined) update['profile'].preferences.notificationsEnabled = updateData.notificationsEnabled;
            }
        }

        // Meta
        if (updateData.isActive !== undefined || updateData.lastLogin) {
            update['meta'] = {};
            if (updateData.isActive !== undefined) update['meta'].isActive = updateData.isActive;
            if (updateData.lastLogin) update['meta'].lastLogin = updateData.lastLogin;
        }

        // Plan
        if (updateData.type || updateData.price) {
            update['plan'] = {};
            if (updateData.type) update['plan'].type = updateData.type;
            if (updateData.price) update['plan'].price = updateData.price;
        }

        // Realiza la actualización
        return await this.usersModel.findByIdAndUpdate(_id, { $set: update }, { new: true }).select('-auth.passwordHash').exec();
    }
}
