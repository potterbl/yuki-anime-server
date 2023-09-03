import {Module} from "@nestjs/common";
import {VideosController} from "./videos.controller";
import {VideosService} from "./videos.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Video, VideoSchema} from "./schemas/video.schema";
import {Account, AccountSchema} from "../auth/schemas/account.schema";
import {MulterModule, MulterModuleOptions} from "@nestjs/platform-express";
import { diskStorage } from 'multer';

@Module({
    providers: [VideosService],
    controllers: [VideosController],
    imports: [MongooseModule.forFeature([
        {name: Video.name, schema: VideoSchema},
        {name: Account.name, schema: AccountSchema}
    ]),
        MulterModule.registerAsync({
            useFactory: () => {
                const storageOptions: MulterModuleOptions['storage'] = diskStorage({
                    destination: './uploads',
                    filename: (_, file, callback) => {
                        callback(null, file.originalname);
                    },
                });
                return {
                    storage: storageOptions,
                };
            },
        }),
    ]
})

export class VideosModule {

}