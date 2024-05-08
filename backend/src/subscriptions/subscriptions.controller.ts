import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, Res, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Request } from 'express';


@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) { }

  @Post('/create')
  create(@Body() body) {
    try {
      return this.subscriptionsService.create(body)
    } catch (error) {
      return error.response
    }
  }

  @Post('/confirm')
  confirm(@Body() body) {
    try {
      return this.subscriptionsService.confirmSubscription(body)
    } catch (error) {
      return error.response
    }
  }

  @Get('/get')
  accessSubscription(@Query('userId') userId, @Query('productId') productId) {
    try {
      return this.subscriptionsService.accessSubscription(userId, productId)
    } catch (error) {
      return error.response
    }
  }

  @Put('/cancel')
  cancelSubscription(@Body() body) {
    try {
      return this.subscriptionsService.cancelSubscription(body)
    } catch (error) {
      return error.response
    }
  }


  @Get('/checkout')
  async checkout(@Req() req: Request, @Res() res: Response) {
    return this.subscriptionsService.checkout(req, res)
  }

  @Get('/get-session')
 async getSession() {
    try {
      return this.subscriptionsService.retriveSession()
    } catch (error) {
      return error.response
    }
  }

}
