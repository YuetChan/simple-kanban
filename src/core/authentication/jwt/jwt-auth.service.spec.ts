import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthService } from './jwt-auth.service';

describe('JwtService', () => {
  let svc: JwtAuthService;

  beforeEach(async () => {
    svc = new JwtAuthService(null, null);
  });

  it('should be defined', () => {
    expect(svc).toBeDefined();
  });
});
