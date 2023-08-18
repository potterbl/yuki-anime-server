import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type AccountDocument = Account & Document

export type historyType = {
    animeId: string,
    season: string,
    episode: string
}

@Schema()
export class Account {

    @Prop()
    name: string

    @Prop()
    login: string

    @Prop()
    password: string

    @Prop()
    avatar: string

    @Prop()
    history: historyType[]

    @Prop()
    likes: string[]

    @Prop()
    dislikes: string[]

    @Prop()
    accountType: string

    @Prop()
    userCollections: object[]
}

export const AccountSchema = SchemaFactory.createForClass(Account)