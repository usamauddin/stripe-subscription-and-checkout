import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeModule } from 'src/stripe/stripe.module';
import { UserModel, UserSchema } from 'src/user/entities/user.entity';
import { ProductModel, ProductSchema } from 'src/product/entities/product.entity';
import { SubscriptionModel, SubscriptionSchema } from './entities/subscription.entity';

@Module({
  imports: [
    StripeModule,
    MongooseModule.forFeature([{ name: UserModel, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: SubscriptionModel, schema: SubscriptionSchema }]),
    MongooseModule.forFeature([{ name: ProductModel, schema: ProductSchema }]),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})

export class SubscriptionsModule { }
