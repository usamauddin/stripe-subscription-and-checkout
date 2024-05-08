import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModel } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';
import { ProductDocument, ProductModel } from 'src/product/entities/product.entity';
import { SubscriptionDocument, SubscriptionModel } from './entities/subscription.entity';
import { StripeService } from 'src/stripe/stripe.service';
import * as nodemailer from 'nodemailer'


@Injectable()
export class SubscriptionsService {

  constructor(
    private stripeService: StripeService,
    @InjectModel(UserModel) private user: Model<UserDocument>,
    @InjectModel(SubscriptionModel) private subscription: Model<SubscriptionDocument>,
    @InjectModel(ProductModel) private product: Model<ProductDocument>
  ) { }


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

  async create(body) {
    try {

      const { userId, productId, stripeProductId, customerId, priceId } = body
      const user = await this.user.findOne({ _id: userId })

      if (user) {

        const product = await this.product.findOne({ _id: productId })

        if (product) {

          const stripeProduct = await this.stripeService.findProduct(stripeProductId)

          if (stripeProduct) {

            const subscription = await this.stripeService.createSubscription(customerId, priceId)

            return {
              message: 'subscription created',
              statusCode: 200,
              data: {
                subscriptionId: subscription.id,
                clientSecret: subscription.latest_invoice.payment_intent.client_secret,
              }
            }

          }
          else {
            throw new NotFoundException({ message: 'product not found on stripe.', statusCode: 400, data: null })
          }
        }
        else {
          throw new NotFoundException({ message: 'product not found.', statusCode: 400, data: null })
        }
      }
      else {
        throw new NotFoundException({ message: 'user not found.', statusCode: 400, data: null })
      }

    } catch (error) {
      return error.response
    }
  }

  async confirmSubscription(body) {
    try {

      const { userId, productId, stripeProductId } = body
      const user = await this.user.findOne({ _id: userId })

      if (user) {

        const product = await this.product.findOne({ _id: productId })

        if (product) {

          const stripeProduct = await this.stripeService.findProduct(stripeProductId)

          if (stripeProduct) {

            const subscriptionExsist = await this.subscription.findOne({ userId: userId })
            if (subscriptionExsist) {

              const stripeSubscription = await this.stripeService.findSubscription(subscriptionExsist.stripeSubscriptionId)
              if (stripeSubscription) {

                await this.stripeService.cancelSubscription(subscriptionExsist.stripeSubscriptionId)
                const startTime = new Date().getTime()

                const date = new Date();
                date.setMonth(date.getMonth() + 1);
                date.setHours(0, 0, 0, 0);

                const endTime = date.getTime();
                const newBody = { ...body, startTime, endTime }

                const newSubscription = await this.subscription.findByIdAndUpdate({ _id: subscriptionExsist._id }, newBody, { new: true })

                return {
                  message: 'subscriprion updated',
                  statusCode: 200,
                  data: newSubscription
                }

              }
              else {
                throw new NotFoundException({ message: 'subscription not found on stripe', statusCode: 400, data: null })
              }

            }
            else {
              const startTime = new Date().getTime()

              const date = new Date();
              date.setMonth(date.getMonth() + 1);
              date.setHours(0, 0, 0, 0);

              const endTime = date.getTime();
              var subscription = await this.subscription.create({ ...body, startTime, endTime })

              return {
                message: 'new subscription created',
                statusCode: 200,
                data: subscription,
              }
            }

          }
          else {
            throw new NotFoundException({ message: 'product not found on stripe.', statusCode: 400, data: null })
          }
        }
        else {
          throw new NotFoundException({ message: 'product not found.', statusCode: 400, data: null })
        }
      }
      else {
        throw new NotFoundException({ message: 'user not found.', statusCode: 400, data: null })
      }

    } catch (error) {
      return error.response
    }
  }

  async accessSubscription(userId, productId) {
    try {
      const user = await this.user.findOne({ _id: userId })
      if (user) {
        const subscription = await this.subscription.findOne({ $and: [{ userId: { $eq: userId } }, { productId: { $eq: productId } }] })
        if (subscription) {
          if (subscription.status === 'active') {
            return {
              message: 'subscription found',
              statusCode: 200,
              data: subscription
            }
          }
          else {
            throw new NotFoundException({ message: 'Subscription expired', statusCode: 400, data: null })
          }
        }
        else {
          throw new BadRequestException({ message: 'Subscription not found', statusCode: 400, data: null })
        }
      }
      else {
        throw new NotFoundException({ message: 'user not found.', statusCode: 400, data: null })
      }
    } catch (error) {
      return error.response
    }
  }

  async cancelSubscription(body) {
    try {
      const { userId, subscriptionId, stripeSubscriptionId } = body
      const user = await this.user.findOne({ _id: userId })
      if (user) {
        const subscription = await this.subscription.findOne({ _id: subscriptionId })
        if (subscription) {

          const stripeSubscription = await this.stripeService.findSubscription(stripeSubscriptionId)

          if (stripeSubscription) {

            const result = await this.stripeService.cancelSubscription(stripeSubscriptionId)
            const updatedSubscription = await this.subscription.findByIdAndUpdate({ _id: subscription._id }, { status: 'cancelled' }, { new: true })
            const product = await this.product.findOne({ _id: updatedSubscription.productId })
            await this.sendEmail(user.email, `your subscription of ${product.name} cancelled`)

            return {
              message: 'subscription cancelled',
              statusCode: 200,
              data: updatedSubscription
            }

          }
          else {
            throw new NotFoundException({ message: 'subscription not found on stripe.', statusCode: 400, data: null })
          }
        }
        else {
          throw new NotFoundException({ message: 'subscription not found.', statusCode: 400, data: null })
        }
      }
      else {
        throw new NotFoundException({ message: 'user not found', statusCode: 400, data: null })
      }

    } catch (error) {
      return error.response
    }
  }

  async checkout(req, res) {
    try {
      return this.stripeService.checkout(req, res)
    } catch (error) {
      return error.response
    }
  }

  async retriveSession() {
    return this.stripeService.retriveSession()
  }

}
