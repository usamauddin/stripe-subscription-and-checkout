import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, RawBodyRequest } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { Request, Response } from 'express';

@Controller('webhook')
export class WebhooksController {

  constructor(private readonly webhooksService: WebhooksService) { }

  @Post('/events')
  async handleIncomingEvents(@Req() req: RawBodyRequest<Request>, @Res() res: Response) {
    try {
      const raw = req.rawBody
      return await this.webhooksService.handleIncomingEvents(raw, req, res)
    } catch (error) {
      return error.response
    }
  }


}
