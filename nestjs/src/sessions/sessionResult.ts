import { File } from "src/common/models/file/file.model"
import { BoundingBox } from "./boundingBox"

export class SessionResult {
    file: File
    boundingBoxes: BoundingBox[]
}