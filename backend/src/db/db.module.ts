import { DBService } from './db.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forRootAsync({
        useClass: DBService
    })],
})

export class DBModule {};