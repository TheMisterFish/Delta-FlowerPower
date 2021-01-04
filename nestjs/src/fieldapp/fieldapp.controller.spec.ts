import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { FieldappController } from './fieldapp.controller';
import { FieldappService } from './fieldapp.service';

describe('FieldappController', () => {
  let controller: FieldappController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldappController],
      providers: [
        FieldappService,
        {
          provide: getModelToken('File'),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<FieldappController>(FieldappController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
