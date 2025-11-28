import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from '../../../src/modules/patients/controllers/patients.controller';
import { PatientsService } from '../../../src/modules/patients/services/patients.service';

describe('PatientsController', () => {
  let controller: PatientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [PatientsService],
    }).compile();

    controller = module.get<PatientsController>(PatientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
