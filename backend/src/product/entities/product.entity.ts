import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { UserModel } from "src/user/entities/user.entity";

@Schema()
export class Product {

    @Prop({ required: true, type: Types.ObjectId, ref: UserModel })
    userId: Types.ObjectId;

    @Prop({ required: true })
    stripeId: string;

    @Prop({ required: true })
    priceId: string;

    @Prop({ required: true })
    productId: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    currency: string;

    @Prop({ required: true })
    interval: string;

    @Prop({ required: true })
    name: string;

}

export const ProductSchema = SchemaFactory.createForClass(Product) 
export const ProductModel = 'Product'
export type ProductDocument = Product & Document
