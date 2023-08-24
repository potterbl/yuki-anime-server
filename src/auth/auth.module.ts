import { Module } from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthController} from "./auth.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {Account, AccountSchema} from "./schemas/account.schema";
import {MailerModule} from "@nestjs-modules/mailer";

@Module({
    providers: [AuthService],
    controllers: [AuthController],
    imports: [
        MongooseModule.forFeature([
        {name: Account.name, schema: AccountSchema}
    ]),
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    type: 'login',
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                },
            }
        })
    ]
})
export class AuthModule {}
