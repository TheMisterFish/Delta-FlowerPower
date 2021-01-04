import { Test, TestingModule } from '@nestjs/testing';
import { FieldappController } from './fieldapp.controller';

describe('FieldappController', () => {
  let controller: FieldappController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldappController],
    }).compile();

    controller = module.get<FieldappController>(FieldappController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
