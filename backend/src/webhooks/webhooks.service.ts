import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer'
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModel } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';
import { SubscriptionDocument, SubscriptionModel } from 'src/subscriptions/entities/subscription.entity';
import { ProductDocument, ProductModel } from 'src/product/entities/product.entity';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class WebhooksService {

  private stripe: Stripe;

  constructor(
    private config: ConfigService,
    private stripeService: StripeService,
    @InjectModel(UserModel) private user: Model<UserDocument>,
    @InjectModel(ProductModel) private product: Model<ProductDocument>,
    @InjectModel(SubscriptionModel) private subscription: Model<SubscriptionDocument>,
  ) {
    this.stripe = new Stripe(config.get('secretKey'), {
      apiVersion: '2023-10-16'
    })
  }

  sendEmail(email, text) {
    try {

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        requireTLS: true,
        secure: false,
        auth: {
          user: "usama.tezeract@gmail.com",
          pass: "rplg uhms txwg mtzx"
        }
      })

      const mailOptions = {
        from: "usama.tezeract@gmail.com",
        to: email,
        subject: "Product subscription",
        text: text
      }

      return transporter.sendMail(mailOptions)
        .then(() => {
          // console.log('email sent');
          return true
        })
        .catch((err) => {
          console.log(err);
          throw new ServiceUnavailableException('error sending email.')
        })
    } catch (error) {
      return error.response
    }
  }

  async handleIncomingEvents(raw, req, res) {

    const endpointSecret = "whsec_4a29a4e77bf69b9dc7a8500e7a4cc4ec998ce04b753640d694a8ebf9242f6b47"
    const sig = req.headers['stripe-signature']

    let event;

    try {
      event = this.stripe.webhooks.constructEvent(raw, sig, endpointSecret)
      // console.log(event)
    } catch (err) {
      console.log(err);

      res.status(400).send(`Webhook Error: ${err.message}`)
      return;
    }

    // console.log(raw)
    switch (event.type) {

      case 'invoice.payment_succeeded':

        const invoicePaymentSucceeded = event.data.object;

        console.log(invoicePaymentSucceeded)

        const billingReason = invoicePaymentSucceeded.billing_reason
        const subscription = await this.subscription.findOne({ customerId: invoicePaymentSucceeded.customer })
        const product = await this.product.findOne({ productId: subscription.stripeProductId })

        if (billingReason === 'subscription_create') {
          console.log(billingReason)
          // await this.sendEmail(invoicePaymentSucceeded.customer_email, `you successfully subscribed ${product.name}`);
        } else if (billingReason === 'subscription_cycle') {

          const startTime = new Date().getTime()
          const date = new Date();
          date.setMonth(date.getMonth() + 1)
          date.setHours(0, 0, 0, 0)

          const endTime = date.getTime();

          const updatedSubscription = await this.subscription.findByIdAndUpdate({ stripeSubscriptionId: subscription }, { startTime, endTime }, { new: true })
          // await this.sendEmail(invoicePaymentSucceeded.customer_email, `your subscription is successfully renewd ${product.name}`);
        }

        break;

      case 'invoice.upcoming':

        const invoiceUpcoming = event.data.object;
        const userEmail = invoiceUpcoming.customer_details.email
        await this.sendEmail(userEmail, 'your subscription is ending')

        break;

      case 'subscription_schedule.completed':

        const subscriptionScheduleCompleted = event.data.object;
        const user_email = subscriptionScheduleCompleted.customer_details.email
        await this.sendEmail(user_email, 'your subscription schedule is comleted')
        break;

      case 'invoice.payment_failed':
        const invoicePaymentFailed = event.data.object
        // console.log(invoicePaymentFailed)

        const subscriptionId = invoicePaymentFailed.subscription
        const isSubscriptionExsist = await this.subscription.findOne({ stripeSubscriptionId: subscriptionId })

        if (isSubscriptionExsist) {
          const stripeSubscription = await this.stripeService.findSubscription(isSubscriptionExsist.stripeSubscriptionId)

          if (stripeSubscription.status === 'canceled' || stripeSubscription.status === 'unpaid') {
            await this.subscription.findByIdAndUpdate({ _id: isSubscriptionExsist._id }, { status: 'expired' }, { new: true })
            // await this.sendEmail(invoicePaymentFailed.customer_email, 'your subscription is expired')
          }

        }
        else {
          console.log('not found')
          // await this.sendEmail(invoicePaymentFailed.customer_email, 'payment failed')
        }

        break;

      default:
        console.log(`Unhandled event type ${event.type}`)
    }
  }

}
