import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type CollectionDocument = Collection & Document

export type videoType = {
    episode: number,
    videoId: string,
    description: string
}

@Schema()
export class Collection {
    @Prop()
    title: string

    @Prop()
    preview: string

    @Prop()
    image: string

    @Prop()
    description: string

    @Prop()
    watches: number

    @Prop()
    likes: number

    @Prop()
    dislikes: number

    @Prop()
    videos: videoType[][]

    @Prop()
    genre: string[]

    @Prop()
    date: string
}

export const CollectionSchema = SchemaFactory.createForClass(Collection)