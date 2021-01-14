import { File } from "src/common/models/file/file.model";

export class UpdateAimodelDto { 
  name: string;

  description: string;

  weights: File[];

  path: string;

  updated_at: Date;
}