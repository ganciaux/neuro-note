import { Test, TestingModule } from '@nestjs/testing';
import { EnumTypesService } from '../../../src/modules/enum-types/services/enum-types.service';

describe('EnumTypesService', () => {
  let service: EnumTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnumTypesService],
    }).compile();

    service = module.get<EnumTypesService>(EnumTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
