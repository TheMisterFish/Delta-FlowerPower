import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { AimodelsService } from './aimodels.service';

describe('AimodelsService', () => {
  let service: AimodelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AimodelsService,
        {
          provide: getModelToken('Aimodel'),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AimodelsService>(AimodelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
