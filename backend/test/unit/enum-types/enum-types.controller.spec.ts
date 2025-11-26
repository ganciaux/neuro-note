import { Test, TestingModule } from '@nestjs/testing';
import { EnumTypesController } from 'src/modules/enum-types/controllers/enum-types.controller';
import { EnumTypesService } from 'src/modules/enum-types/services/enum-types.service';

describe('EnumTypesController', () => {
  let controller: EnumTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnumTypesController],
      providers: [EnumTypesService],
    }).compile();

    controller = module.get<EnumTypesController>(EnumTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
