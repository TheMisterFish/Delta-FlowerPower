import { prop } from "@typegoose/typegoose"

export class File {
    @prop()
    filePath: string;

    @prop()
    fileName: string;
    
    @prop()
    fileSize: number;
}
