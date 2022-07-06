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
    console.trace('Enter createTask(req, body)');

    const user  = req.user;
    const task = body.data.task;

    try {
      const project = await axios.get(`${this.REST_HOST}/projects/${task.projectId}`).then(res => {
        console.debug('Res ', res);
        return res.data.data.project;
      });

      const hasWritePermission = user.permissionList.filter(permission => 
        (permission.objectId === project.projectId 
          && permission.permit === 'WRITE' 
          && permission.permissible === 'PROJECT_TASK')) > 0;
      const isOwner = user.email === project.userEmail;

      if(!hasWritePermission && !isOwner) { throw new ForbiddenException(); }

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
    console.trace('Enter updateTaskById(req, body, params)');

    const user  = req.user;
  
    const updatedTask = body.data.task;
    const taskId = params.id;

    try {
      const task = await axios.get(`${this.REST_HOST}/tasks/${taskId}`).then(res => {
        console.debug('Res ', res);
        return res.data.data.task;
      });

      const projectId = task.projectId;
      const project = await axios.get(`${this.REST_HOST}/projects/${projectId}`).then(res => {
        console.debug('Res ', res);
        return res.data.data.project;
      });

      const hasWritePermission = user.permissionList.filter(permission => 
        (permission.objectId === projectId 
          && permission.permit === 'WRITE' 
          && permission.permissible === 'PROJECT_TASK')) > 0;
      const isOwner = user.email === project.userEmail;
      if(!isOwner && !hasWritePermission) { throw new ForbiddenException(); }

      return await axios.patch(`${this.REST_HOST}/tasks/${taskId}`, {
        data: { task: updatedTask }
      }).then(res => {
        console.debug('Res ', res);
        if(res.status !== HttpStatus.NO_CONTENT) { throw new InternalServerErrorException(); }
        return res.data;
      });
    }catch(err) {
      console.debug('Err ', err);

      if(err?.response?.status === HttpStatus.BAD_REQUEST) { throw new BadRequestException(); }
      throw new InternalServerErrorException();
    }
  }
  
}
