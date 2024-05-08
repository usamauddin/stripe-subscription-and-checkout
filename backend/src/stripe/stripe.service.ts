import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private config: ConfigService) {
    this.stripe = new Stripe(config.get('secretKey'), {
      apiVersion: '2023-10-16',
    });
  }

  async createCustomer(name, email) {
    try {
      return this.stripe.customers.create({
        name,
        email,
      });
    } catch (error) {
      return error.response;
    }
  }

  async findCustomer(id) {
    try {
      const result = await this.stripe.customers.retrieve(id);
      return result;
    } catch (error) {
      return error.response;
    }
  }

  async createProduct(name) {
    try {
      const product = await this.stripe.products.create({ name });
      return product;
    } catch (error) {
      return error.response;
    }
  }

  async craetePrice(currency, amount, interval, product) {
    try {
      const price = await this.stripe.prices.create({
        currency,
        unit_amount: amount,
        product,
        recurring: {
          interval,
        },
      });
      return price;
    } catch (error) {
      return error.response;
    }
  }

  async findProduct(id) {
    try {
      const result = await this.stripe.products.retrieve(id);
      return result;
    } catch (error) {
      return error.response;
    }
  }

  async updateProduct(id, name) {
    try {
      return await this.stripe.products.update(id, { name });
    } catch (error) {
      return error.response;
    }
  }

  async deleteProduct(productId, priceId) {
    try {
      await this.stripe.prices.update(priceId, { active: false });
      const product = await this.stripe.products.del(productId);
      return product;
    } catch (error) {
      return error.response;
    }
  }

  async updatePrice(priceId, newProduct) {
    try {
      await this.stripe.prices.update(priceId, { active: false });

      const price = await this.stripe.prices.create({
        currency: newProduct.currency,
        unit_amount: newProduct.amount,
        product: newProduct.productId,
        recurring: {
          interval: newProduct.interval,
        },
      });

      return price;
    } catch (error) {
      return error.response;
    }
  }

  geneartePaymentLink(priceId) {
    try {
      return this.stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        submit_type: 'pay',
      });
    } catch (error) {
      return error.response;
    }
  }

  async findSubscription(id) {
    try {
      const result = await this.stripe.subscriptions.retrieve(id);
      return result;
    } catch (error) {
      return error.response;
    }
  }

  async cancelSubscription(id) {
    try {
      return await this.stripe.subscriptions.update(id, {
        cancel_at_period_end: true,
      });
    } catch (error) {
      return error.response;
    }
  }

  async resumeSubscription(id) {
    try {
      return await this.stripe.subscriptions.resume(id);
    } catch (error) {
      return error.response;
    }
  }

  async createSubscription(customerId, priceId) {
    try {

      // if new user is purchasig subscription then open form , old user is then show them there old payment details using paymentMethod.list then get id of payment method to create subscription
       
      const subscriptionn = await this.stripe.subscriptions.create({
        customer: 'cus_PQBisoZ5vxNunP',
        items: [
          {
            price: 'price_1OWfudIRWDZKhzHnxt0gWdHK', // monthly
            // price: 'price_1OWyDYIRWDZKhzHn13l7sF6H'
          },
        ],
        default_payment_method: 'pm_1ObLYaIRWDZKhzHnDOm1TyxL',
        // payment_behavior: 'default_incomplete',
        // payment_settings: {
        //   save_default_payment_method: 'on_subscription',
        // },
        // expand: ['latest_invoice.payment_intent'],
        // coupon: '3vrI51s7'
        // coupon: '3vrI51s7'
      });

      const subscription = await this.stripe.subscriptions.update(
        'sub_1PE7I8IRWDZKhzHnGFRqGwTL',
        {
          default_payment_method: 'pm_1PE601IRWDZKhzHnQyKnbRza',
          // default_payment_method: 'pm_1ObLYaIRWDZKhzHnDOm1TyxL',
        },
      );
      // return subscription;

      const paymentMethods = await this.stripe.paymentMethods.list({
        // type: 'card',
        // limit: 3,
        customer: 'cus_PQBisoZ5vxNunP',
        // customer: 'cus_9s6XKzkNRiz8i3',
      });

      // return paymentMethods;
    } catch (error) {
      return error.response;
    }
  }

  async checkout(req, res) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        billing_address_collection: 'required',
        phone_number_collection: {
          enabled: true,
        },
        submit_type: 'pay',
        line_items: [
          {
            price: 'price_1OZs4AIRWDZKhzHn0HpZelkx',
            quantity: 1,
          },
        ],
        mode: 'payment',
        ui_mode: 'embedded',
        return_url: `https://example.com/return?session_id={CHECKOUT_SESSION_ID}`,
        discounts: [{ coupon: '3vrI51s7' }],
      });

      res.send(session);
    } catch (error) {
      return error.response;
    }
  }

  async retriveSession() {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(
        'cs_test_a1rBziV2O4ymsquATbPzyjabF1uiG2YywnBT5SrKJnGMoMkfkIp3dxTit3',
      );
      return session;
    } catch (error) {
      return error.response;
    }
  }

  async createCoupon() {
    try {
      const coupon = await this.stripe.coupons.create({
        duration: 'once',
        // duration_in_months: 3,
        percent_off: 30,
      });
      return coupon;
    } catch (error) {
      return error.response;
    }
  }
}
