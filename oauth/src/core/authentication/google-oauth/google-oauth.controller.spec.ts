import { Test, TestingModule } from '@nestjs/testing';
import { GoogleOauthController } from './google-oauth.controller';

describe('GoogleOauthController', () => {
  
  let controller: GoogleOauthController;

  beforeEach(async () => {
    controller = new GoogleOauthController(null);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
