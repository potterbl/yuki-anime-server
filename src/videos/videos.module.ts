import {Module} from "@nestjs/common";
import {VideosController} from "./videos.controller";
import {VideosService} from "./videos.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Video, VideoSchema} from "./schemas/video.schema";

@Module({
    providers: [VideosService],
    controllers: [VideosController],
    imports: [MongooseModule.forFeature([
        {name: Video.name, schema: VideoSchema}
    ])]
})

export class VideosModule {

}