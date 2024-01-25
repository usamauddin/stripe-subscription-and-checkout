import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UserModel, UserSchema } from 'src/user/entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeModule } from 'src/stripe/stripe.module';
import { ProductModel, ProductSchema } from './entities/product.entity';

@Module({
  imports: [
    StripeModule,
    MongooseModule.forFeature([{ name: UserModel, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: ProductModel, schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})

export class ProductModule { }
