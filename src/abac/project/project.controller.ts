import { BadRequestException, Body, Controller, ForbiddenException, HttpCode, HttpStatus, InternalServerErrorException, Post, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Controller('project')
export class ProjectController {
  
  private REST_HOST = '';

  constructor(private configSvc: ConfigService) { this.REST_HOST = this.configSvc.get<string>('REST_HOST'); }

  @Post()
  @HttpCode(201)
  async createTask(@Req() req: any, @Body() body) { 
    console.log('createProject', { body: JSON.stringify(body) });

    const user  = req.user;
    const project = body.data.project;

    try {
      const isOwner = user.email === project.userEmail;
      if(!isOwner) { throw new ForbiddenException(); }

      return await axios.post(`${this.REST_HOST}/projects`, {
        data: { project: project }
      }).then(res => {
        if(res.status !== HttpStatus.CREATED) { throw new InternalServerErrorException(); }
        return res.data;
      });
    }catch(e) {
      console.log(e);

      if(e?.response?.status === HttpStatus.BAD_REQUEST) { throw new BadRequestException(); }
      throw new InternalServerErrorException();
    }
  }

}
