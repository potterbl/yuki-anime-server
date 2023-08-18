import { Module } from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthController} from "./auth.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {Account, AccountSchema} from "./schemas/account.schema";

@Module({
    providers: [AuthService],
    controllers: [AuthController],
    imports: [MongooseModule.forFeature([
        {name: Account.name, schema: AccountSchema}
    ])]
})
export class AuthModule {}
