import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Plan {
    @Prop()
    type: string;

    @Prop()
    price: number;

    @Prop({ default: Date.now })
    activatedAt: Date;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);

@Schema()
export class Meta {
    @Prop()
    isActive: boolean;

    @Prop()
    lastLogin: string;

    @Prop({ default: Date.now })
    registeredAt: Date;
}

export const MetaSchema = SchemaFactory.createForClass(Meta);