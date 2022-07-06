import { BadRequestException, Body, Controller, ForbiddenException, HttpCode, HttpStatus, InternalServerErrorException, Param, Patch, Post, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';

@Controller('projects')
export class ProjectController {
  
  private REST_HOST = '';

  constructor(private configSvc: ConfigService) { this.REST_HOST = this.configSvc.get<string>('REST_HOST'); }

  @Post()
  @HttpCode(201)
  async createProject(@Req() req: any, @Body() body) { 
    console.trace('Enter createProject(req, body)');

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
      if(e?.response?.statusCode === HttpStatus.FORBIDDEN) { throw new ForbiddenException(); }
      throw new InternalServerErrorException();
    }
  }

  @Patch(':id')
  @HttpCode(204)
  async updateProjectById(@Req() req: any, @Body() body, @Param() params) { 
    console.trace('Enter updateProjectById(req, body, params)');

    const user  = req.user;
  
    const updatedProject = body.data.project;
    const projectId = params.id;

    try {
      const project = await axios.get(`${this.REST_HOST}/projects/${projectId}`).then(res => {
        console.debug('Res ', res);
        return res.data.data.project
      });

      const isOwner = project.userEmail === user.email;
      if(!isOwner) { throw new ForbiddenException(); }

      return await axios.patch(`${this.REST_HOST}/projects/${projectId}`, {
        data: { project: updatedProject }
      }).then(res => {
        console.debug('Res ', res);

        if(res.status !== HttpStatus.NO_CONTENT) { throw new InternalServerErrorException(); }
        return res.data;
      });
    }catch(err) {
      console.log('Err', err);

      if(err?.response?.status === HttpStatus.BAD_REQUEST) { throw new BadRequestException(); }
      if(err?.response?.statusCode === HttpStatus.FORBIDDEN) { throw new ForbiddenException(); }
      throw new InternalServerErrorException();
    }
  }

}
