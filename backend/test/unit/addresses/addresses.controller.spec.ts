import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController } from '../../../src/modules/addresses/controllers/addresses.controller';
import { AddressesService } from '../../../src/modules/addresses/services/addresses.service';

describe('AddressesController', () => {
  let controller: AddressesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressesController],
      providers: [AddressesService],
    }).compile();

    controller = module.get<AddressesController>(AddressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
