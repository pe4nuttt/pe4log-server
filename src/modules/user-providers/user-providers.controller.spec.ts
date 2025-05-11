import { Test, TestingModule } from '@nestjs/testing';
import { UserProvidersController } from './user-providers.controller';
import { UserProvidersService } from './user-providers.service';

describe('UserProvidersController', () => {
  let controller: UserProvidersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserProvidersController],
      providers: [UserProvidersService],
    }).compile();

    controller = module.get<UserProvidersController>(UserProvidersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
