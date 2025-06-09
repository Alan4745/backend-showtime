import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// import { HydratedDocument } from "mongoose";

// export type UsersDocument = HydratedDocument<Users>;

@Schema()
export class Users {
    @Prop()
    name: String;
    @Prop()
    email: String;
    @Prop()
    password: String;
    @Prop({ default: Date.now })
    createdAt: Date
}

export const UsersSchema = SchemaFactory.createForClass(Users);