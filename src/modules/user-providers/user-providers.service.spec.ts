import { Test, TestingModule } from '@nestjs/testing';
import { UserProvidersService } from './user-providers.service';

describe('UserProvidersService', () => {
  let service: UserProvidersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserProvidersService],
    }).compile();

    service = module.get<UserProvidersService>(UserProvidersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
