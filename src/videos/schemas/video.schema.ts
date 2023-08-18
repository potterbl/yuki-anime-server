import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type VideoDocument = Video & Document

@Schema()
export class Video{
    @Prop()
    title: string

    @Prop()
    link: string
}

export const VideoSchema = SchemaFactory.createForClass(Video)