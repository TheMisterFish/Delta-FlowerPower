import { BoundingBox } from "./boundingBox"
import { File } from "./file"

export class SessionResult {
    file: File
    boundingBoxes: BoundingBox[]
}