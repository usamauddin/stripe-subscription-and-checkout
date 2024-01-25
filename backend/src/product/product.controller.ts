import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { ProductService } from './product.service';


@Controller('product')
export class ProductController {

  constructor(private readonly productService: ProductService) { }

  @Post('/add')
  addProduct(@Body() body) {
    try {
      return this.productService.addProduct(body)
    } catch (error) {
      return error.response
    }
  }


  @Put('/update-name')
  updateProductName(@Body() body) {
    try {
      return this.productService.updateProductName(body)
    } catch (error) {
      return error.response
    }
  }

  @Put('/update-price')
  updateProductPrice(@Body() body) {
    try {
      return this.productService.updateProductPrice(body)
    } catch (error) {
      return error.response
    }
  }

  @Get('/get')
  getProducts() {
    try {
      return this.productService.getProducts()
    } catch (error) {
      return error.response
    }
  }

  @Delete('/delete')
  deleteProducts(@Body() body) {
    try {
      return this.productService.deleteProduct(body)
    } catch (error) {
      return error.response
    }
  }

  @Get('/payment')
  createPayment(@Query('priceId') priceId) {
    try {
      return this.productService.createPayment(priceId)
    } catch (error) {
      return error.response
    }
  }


}
