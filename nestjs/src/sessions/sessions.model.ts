import { IsString, IsDate } from 'class-validator';
import { prop } from "@typegoose/typegoose";


export class Session {
  @IsString()
  @prop()
  name: string;

  @prop()
  description: string;

  @prop({ ref: 'Locations' })
  location_id: string;

  @prop({ ref: 'Users' })
  made_by: string;

  @prop()
  flower_count: JSON;

  @prop({ ref: 'Models' })
  model_id: string;

  @IsDate()
  @prop()
  created_at: Date;

  @IsDate()
  @prop()
  updated_at: Date;
}

