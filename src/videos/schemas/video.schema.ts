import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type VideoDocument = Video & Document

@Schema()
export class Video{
    @Prop()
    animeId: string

    @Prop()
    episode: string

    @Prop()
    season: string

    @Prop()
    link: string
}

export const VideoSchema = SchemaFactory.createForClass(Video)