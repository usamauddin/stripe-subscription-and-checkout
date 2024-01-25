import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from 'src/user/entities/user.entity';
import { SubscriptionModel, SubscriptionSchema } from 'src/subscriptions/entities/subscription.entity';
import { ProductModel, ProductSchema } from 'src/product/entities/product.entity';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [ 
    StripeModule,
    MongooseModule.forFeature([{ name: UserModel, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: ProductModel, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: SubscriptionModel, schema: SubscriptionSchema }]),
],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})

export class WebhooksModule {}
