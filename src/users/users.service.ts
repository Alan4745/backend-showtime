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
}
