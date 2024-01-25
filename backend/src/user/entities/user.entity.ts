import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { hash } from "bcrypt";
import mongoose, { Document, Model } from "mongoose";

@Schema()
export class User {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;
    
    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    stripeId: string;

}


export const UserSchema = SchemaFactory.createForClass(User) 
export const UserModel = 'User'
export type UserDocument = User & Document


UserSchema.pre('save', async function (next) {

    const hashedPassword = await hash(this.password, 10)
    this.password = hashedPassword
    console.log(hashedPassword)
    next()
    
})