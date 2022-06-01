import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {

  let controller: AppController;

  beforeEach(async () => {
    controller = new AppController();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
