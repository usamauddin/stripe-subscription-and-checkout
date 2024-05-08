import { ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as nodemailer from 'nodemailer'
import { UserDocument, UserModel } from './entities/user.entity';
import { Model } from 'mongoose';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class UserService {

    constructor(
    private stripeService: StripeService,
    @InjectModel(UserModel) private user: Model<UserDocument>
    ) { }

    async create(body) {
        try {
            const { name, email } = body
            const result = await this.user.findOne({ email })
            if (result) {
                throw new ServiceUnavailableException('User already exsist.')
            }
            else {
                const data = await this.stripeService.createCustomer(name, email)
                const user = await this.user.create({ ...body, stripeId: data.id })
                return {
                    statusCode: 200,
                    message: 'user created',
                    data: user,
                }
            }
        } catch (error) {
            return error.response
        }
    }
    
}



