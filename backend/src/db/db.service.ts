import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()

export class DBService implements MongooseOptionsFactory {

    constructor(private service: ConfigService) { }

    createMongooseOptions(): MongooseModuleOptions | Promise<MongooseModuleOptions> {
        const name = this.service.get('name')
        
        const password = this.service.get('password')
        // console.log(name, password)

        return {
            uri: `mongodb+srv://${name}:${password}@cluster0.18vbshy.mongodb.net/?retryWrites=true&w=majority`
        }
    }

}