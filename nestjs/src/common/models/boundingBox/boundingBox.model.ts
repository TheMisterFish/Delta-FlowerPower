import { IsNotEmpty, IsNumber } from "class-validator";

export class BoundingBox {
    @IsNotEmpty()
    @IsNumber()
    x1: number;

    @IsNotEmpty()
    @IsNumber()
    y1: number

    @IsNotEmpty()
    @IsNumber()
    x2: number

    @IsNotEmpty()
    @IsNumber()
    y2: number
}