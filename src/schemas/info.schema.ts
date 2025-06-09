import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Info {
    @Prop()
    name: String;
    @Prop()
    email: String;
    @Prop()
    password: String;
    @Prop({ default: Date.now })
    createdAt: Date
}

export const InfoSchema = SchemaFactory.createForClass(Info);