import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create')
  async createCustomer(@Req() req, @Res() res) {
    const { name, email } = req.body;
    const customer = await this.stripeService.createSubscription(name, email)
    res.send(customer);
  }

  @Get('find-customer')
  async findCustomer(@Req() req, @Res() res) {
    const customerId = req.query.id;
    const customer = await this.stripeService.findCustomer(customerId);
    res.send(customer);
  }

  



  // Implement other endpoints similarly
}
