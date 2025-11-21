import { Test, TestingModule } from '@nestjs/testing';
import { EnumTypesController } from '../controllers/enum-types.controller';
import { EnumTypesService } from '../services/enum-types.service';

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
