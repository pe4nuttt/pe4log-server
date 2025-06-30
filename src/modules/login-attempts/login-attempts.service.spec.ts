import { Test, TestingModule } from '@nestjs/testing';
import { LoginAttemptsService } from './login-attempts.service';

describe('LoginAttemptsService', () => {
  let service: LoginAttemptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginAttemptsService],
    }).compile();

    service = module.get<LoginAttemptsService>(LoginAttemptsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
