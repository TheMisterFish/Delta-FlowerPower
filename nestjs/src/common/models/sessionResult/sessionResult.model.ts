import { prop, Ref } from "@typegoose/typegoose";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { BoundingBox } from "../boundingBox/boundingBox.model";
import {File} from "../file/file.model";

export class SessionResult {
    file: File;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BoundingBox)
    boundingBoxes: BoundingBox[];
}