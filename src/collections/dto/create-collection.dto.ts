import {videoType} from "../schemas/collection.schema";

export class CreateCollectionDto {
    readonly title: string
    readonly preview: string
    readonly image: string
    readonly description: string
    readonly watches: number
    readonly likes: number
    readonly dislikes: number
    readonly videos: videoType[]
    readonly genre: string[]
    readonly date: string
}