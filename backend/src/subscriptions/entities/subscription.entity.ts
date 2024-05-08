import { Type } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { ProductModel } from "src/product/entities/product.entity";
import { UserModel } from "src/user/entities/user.entity";

@Schema({
    timestamps: true,
})
export class Subscription {

    @Prop({ required: true })
    customerId: string;

    @Prop({ required: true, ref: UserModel, type: Types.ObjectId })
    userId: Types.ObjectId;

    @Prop({ required: true })
    startTime: number;

    @Prop({ required: true })
    endTime: number;

    @Prop({ required: true })
    stripeProductId: string;

    @Prop({ required: true })
    stripeSubscriptionId: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, ref: ProductModel, type: Types.ObjectId })
    productId: Types.ObjectId;

    @Prop({ required: true, default: 'active' })
    status: string;

}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription)
export const SubscriptionModel = 'Subscription'
export type SubscriptionDocument = Subscription & Document