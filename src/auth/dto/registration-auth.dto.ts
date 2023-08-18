import {historyType} from "../schemas/account.schema";

export class RegistrationAuthDto {
    readonly name: string
    readonly login: string
    readonly password: string
    readonly avatar: string
    readonly history: historyType[] | []
    readonly likes: string[]
    readonly dislikes: string[]
    readonly accountType: string
    readonly userCollections: object[]
}