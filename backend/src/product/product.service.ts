import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDocument, ProductModel } from './entities/product.entity';
import { Model } from 'mongoose';
import { UserDocument, UserModel } from 'src/user/entities/user.entity';
import { StripeService } from 'src/stripe/stripe.service';


@Injectable()
export class ProductService {

  constructor(
    @InjectModel(ProductModel) private product: Model<ProductDocument>,
    @InjectModel(UserModel) private user: Model<UserDocument>,
    private stripeService: StripeService
  ) { }

  async addProduct(body) {
    try {
      if (body.amount <= 0) {
        throw new BadRequestException({
          message: 'Invalid amount', 
          data: null,
          statusCode: 400
        })
      }
      else {
        const { userId, stripeId, currency, amount, interval, name } = body

        const user = await this.user.findById({ _id: userId })

        if (user) {
          const stripeUser = await this.stripeService.findCustomer(stripeId)

          if (stripeUser) {
            if (['day', 'month', 'week', 'year'].includes(interval)) {

              const product = await this.product.find({ $and: [{ userId: { $eq: userId } }, { name: { $eq: name } }] })

              if (product.length === 0) {
                const createdProduct = await this.stripeService.createProduct(name)

                const price = await this.stripeService.craetePrice(currency, amount, interval, createdProduct.id)

                const data = await this.product.create({ ...body, productId: createdProduct.id, priceId: price.id })

                return {
                  message: 'product created',
                  statusCode: 200,
                  data
                }
              }
              else {
                throw new BadRequestException({
                  message: 'Product with same name already exsist.', data: null,
                  statusCode: 400
                })
              }
            }
            else {
              throw new NotFoundException({
                message: 'invalid interval', data: null,
                statusCode: 400
              })
            }
          }
          else {
            throw new NotFoundException({
              message: 'incorrect stripe id.', data: null,
              statusCode: 400
            })
          }
        }
        else {
          throw new NotFoundException({
            message: 'user not found.', data: null,
            statusCode: 400
          })
        }
      }
    } catch (error) {
      return error.response
    }
  }

  async updateProductName(body) {
    try {
      const { userId, stripeId, productId, name } = body
      const user = await this.user.findById({ _id: userId })
      if (user) {
        const stripeUser = await this.stripeService.findCustomer(stripeId)
        if (stripeUser) {
          const isProductExsist = await this.product.findOne({ $and: [{ userId: { $eq: userId } }, { productId: { $eq: productId } }] })

          if (isProductExsist) {

            const stripeProduct = await this.stripeService.findProduct(productId)

            if (stripeProduct) {

              const product = await this.product.find({ $and: [{ userId: { $eq: userId } }, { name: { $eq: name } }] })

              if (product.length === 0) {
                const stripe = await this.stripeService.updateProduct(productId, name)
                const newProduct = await this.product.findByIdAndUpdate({ _id: isProductExsist._id }, { name }, { new: true })

                return {
                  message: 'product updated',
                  statusCode: 200,
                  data: newProduct,
                  // stripe
                }
              }
              else {
                throw new BadRequestException({ message: 'product with same name already exsist', statusCode: 400, data: null })
              }
            }
            else {
              throw new NotFoundException({ message: 'product not found in stripe', statusCode: 400, data: null })
            }
          }
          else {
            throw new NotFoundException({ message: 'product not found.', statusCode: 400, data: null })
          }
        }
        else {
          throw new NotFoundException({ message: 'Stripe id not found.', statusCode: 400, data: null })
        }
      }
      else {
        throw new NotFoundException({ message: 'User not found.', statusCode: 400, data: null })
      }
      // return this.stripeService.updateProduct(body.id, body.name)
    } catch (error) {
      return error.response
    }
  }

  async updateProductPrice(body) {
    try {
      if (body.amount <= 0) {
        throw new BadRequestException({ message: 'Invalid amount', statusCode: 400, data: null })
      }
      else {
        const { userId, stripeId, priceId, productId, interval } = body

        const user = await this.user.findById({ _id: userId })

        if (user) {
          const stripeUser = await this.stripeService.findCustomer(stripeId)

          if (stripeUser) {
            const product = await this.product.findOne({ $and: [{ userId: { $eq: userId } }, { productId: { $eq: productId } }] })

            if (product) {

              if (product.priceId === priceId) {

                console.log(product.priceId)
                console.log(priceId)

                if (['day', 'month', 'week', 'year'].includes(interval)) {
                  delete body.userId
                  delete body.productId
                  delete body.stripeId

                  const newProductt = await this.product.findByIdAndUpdate({ _id: product._id }, body, { new: true })
                  const stripeProduct = await this.stripeService.updatePrice(priceId, newProductt)
                  const newProduct = await this.product.findByIdAndUpdate({ _id: product._id }, { priceId: stripeProduct.id }, { new: true })

                  return {
                    message: 'price updated',
                    statusCode: 200,
                    data: newProduct
                  }

                }
                else {
                  throw new NotFoundException({ message: 'invalid interval', statusCode: 400, data: null })
                }
              }
              else {
                throw new NotFoundException({ message: 'invalid price id', statusCode: 400, data: null })
              }
            }
            else {
              throw new BadRequestException({ message: 'Product not found.', statusCode: 400, data: null })
            }

          }
          else {
            throw new NotFoundException({ message: 'incorrect stripe id.', statusCode: 400, data: null })
          }
        }
        else {
          throw new NotFoundException({ message: 'user not found.', statusCode: 400, data: null })
        }
      }
    } catch (error) {
      return error.response
    }
  }

  async getProducts() {

    try {
      const data = await this.product.find()
      return {
        message: 'product found',
        statusCode: 400, data
      }
    } catch (error) {
      return error.response
    }
  }

  async deleteProduct(body) {

    try {
      const { userId, stripeId, productId, priceId } = body
      const user = await this.user.findById({ _id: userId })
      if (user) {
        const stripeUser = await this.stripeService.findCustomer(stripeId)
        if (stripeUser) {
          const product = await this.product.findOne({ $and: [{ userId: { $eq: userId } }, { productId: { $eq: productId } }] })

          if (product) {
            const stripeProduct = await this.stripeService.findProduct(productId)
            if (stripeProduct) {
              const stripe = await this.stripeService.deleteProduct(productId, priceId)
              return {
                message: 'product deleted',
                statusCode: 200,
                data: stripe
              }
            }
            else {
              throw new NotFoundException({ message: 'product not found n stripe', statusCode: 400, data: null })
            }
          }
          else {
            throw new NotFoundException({ message: 'product not found.', statusCode: 400, data: null })
          }
        }
        else {
          throw new NotFoundException({ message: 'Stripe id not found.', statusCode: 400, data: null })
        }
      }
      else {
        throw new NotFoundException({ message: 'User not found.', statusCode: 400, data: null })
      }
      // return this.stripeService.updateProduct(body.id, body.name)
    } catch (error) {
      return error.response
    }
  }

  async createPayment(priceId) {
    try {
      const product = await this.product.findOne({ priceId: { $eq: priceId } })
      if (product) {
        const link = await this.stripeService.geneartePaymentLink(priceId)
        return link
      }
      else {
        throw new NotFoundException({ message: 'Product not found.', statusCode: 400, data: null })
      }
    } catch (error) {
      return error.response
    }
  }

}
