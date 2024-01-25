import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ConfigModule } from '@nestjs/config';
import { DBModule } from './db/db.module';
import { StripeModule } from './stripe/stripe.module';
import { WebhooksModule } from './webhooks/webhooks.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    SocketModule,
    UserModule,
    ProductModule,
    SubscriptionsModule,
    DBModule,
    StripeModule,
    WebhooksModule],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule { }
