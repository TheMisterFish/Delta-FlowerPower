import { Test, TestingModule } from '@nestjs/testing';
import { AimodelsController } from './aimodels.controller';

describe('AimodelsController', () => {
  let controller: AimodelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AimodelsController],
    }).compile();

    controller = module.get<AimodelsController>(AimodelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
