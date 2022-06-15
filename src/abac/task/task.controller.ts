import { BadRequestException, Body, Controller, ForbiddenException, HttpCode, HttpStatus, InternalServerErrorException, Param, Patch, Post, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';

@Controller('tasks')
export class TaskController {

  private REST_HOST = '';

  constructor(private configSvc: ConfigService) { this.REST_HOST = this.configSvc.get<string>('REST_HOST'); }

  @Post()
  @HttpCode(201)
  async createTask(@Req() req: any, @Body() body) { 
    console.log('createTask', { body: JSON.stringify(body) });

    const user  = req.user;
    const task = body.data.task;

    try {
      const project = await axios.get(`${this.REST_HOST}/projects/${task.projectId}`).then(res => res.data.data.project);

      const isCollaborator = project.collaboratorList.filter(collaborator => collaborator.email === user.email) > 0;
      const isOwner = user.email === project.userEmail;

      if(!isCollaborator && !isOwner) { throw new ForbiddenException(); }

      return await axios.post(`${this.REST_HOST}/tasks`, {
        data: { task: task }
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

  @Patch(':id')
  @HttpCode(204)
  async updateTaskById(@Req() req: any, @Body() body, @Param() params) { 
    console.log('updateTaskById', { body: JSON.stringify(body) });

    const user  = req.user;
  
    const task = body.data.task;
    const taskId = params.id;

    const projectId = task.projectId;

    try {
      const project = await axios.get(`${this.REST_HOST}/projects/${projectId}`).then(res => res.data.data.project);

      const isCollaborator = project.collaboratorList.filter(collaborator => collaborator.email === user.email) > 0;
      const hasWritePermission = user.permissionList.filter(permission => 
        (permission.projectId === projectId && permission.permit === 'WRITE')) > 0;

      const isOwner = user.email === project.userEmail;

      if(!isCollaborator && !isOwner) { throw new ForbiddenException(); }
      if(!isOwner && !hasWritePermission) { throw new ForbiddenException(); }

      return await axios.patch(`${this.REST_HOST}/tasks/${taskId}`, {
        data: { task: task }
      }).then(res => {
        if(res.status !== HttpStatus.NO_CONTENT) { throw new InternalServerErrorException(); }
        return res.data;
      });
    }catch(e) {
      console.log(e);

      if(e?.response?.status === HttpStatus.BAD_REQUEST) { throw new BadRequestException(); }
      throw new InternalServerErrorException();
    }
  }
  
}
