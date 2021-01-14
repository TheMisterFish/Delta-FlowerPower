import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { FieldappService } from './fieldapp.service';

describe('FieldappService', () => {
  let service: FieldappService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FieldappService,
        {
          provide: getModelToken('File'),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<FieldappService>(FieldappService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
