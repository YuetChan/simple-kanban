import { BadRequestException, Body, ConflictException, Controller, ForbiddenException, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Post, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Controller('requests')
export class RequestController {

  private REST_HOST = '';

  constructor(private configSvc: ConfigService) {
    this.REST_HOST = this.configSvc.get<string>('REST_HOST');
  }

  @Post()
  @HttpCode(201)
  async submitRequest(@Req() req: any, @Body() body) { 
    console.log('submitRequest', { body: JSON.stringify(body) });

    const data = body.data;
    const request = data.request;

    try {
      return await axios.post(`${this.REST_HOST}/requests`, {
        data: {
          request: request,
          email: req.user.email
        }
      }).then(res => {
        if(res.status !== HttpStatus.CREATED) { throw new InternalServerErrorException(); }
        return res.data;
      });
    }catch(e) {
      if(e?.response?.status === HttpStatus.CONFLICT) { throw new ConflictException(); }
      if(e?.response?.status === HttpStatus.BAD_REQUEST) { throw new BadRequestException(); }

      throw new InternalServerErrorException();
    }
  }

}
