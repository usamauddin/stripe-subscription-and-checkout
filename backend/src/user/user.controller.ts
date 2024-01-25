import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import Stripe from 'stripe';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Post('/register')
  create(@Body() body) {
    try {
      return this.userService.create(body)
    } catch (error) {
      return error.response
    }
  }

}
