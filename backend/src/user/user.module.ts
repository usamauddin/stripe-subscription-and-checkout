import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './entities/user.entity';
import { StripeService } from 'src/stripe/stripe.service';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [
    StripeModule,
    MongooseModule.forFeature([{ name: UserModel, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
