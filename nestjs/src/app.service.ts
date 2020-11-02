import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Flower power API V0.0.1 - 27-10-2020';
  }
}
