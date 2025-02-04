import { Test, TestingModule } from '@nestjs/testing';
import { UserCommonService } from './user-common.service';

describe('UserCommonService', () => {
  let service: UserCommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCommonService],
    }).compile();

    service = module.get<UserCommonService>(UserCommonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
