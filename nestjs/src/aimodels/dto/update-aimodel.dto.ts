import { File } from '../../sessions/file';

export class UpdateAimodelDto { 
  name: string;

  description: string;

  weights: File[]

  path: string;

  updated_at: Date;
}