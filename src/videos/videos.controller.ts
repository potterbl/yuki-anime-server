import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post, Res,
    UploadedFiles,
    UseInterceptors
} from '@nestjs/common';
import {CreateVideoDto} from "./videoDto/create-video.dto";
import {VideosService} from "./videos.service";
import {Video} from "./schemas/video.schema";
import {FilesInterceptor} from "@nestjs/platform-express";

@Controller('videos')
export class VideosController {

    constructor(private readonly videoService: VideosService) {
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    getAll(): Promise<Video[]> {
        return this.videoService.getAll()
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    getById(@Param('id') id: string): Promise<Video[] | Video>{
        return this.videoService.getById(id)
    }

    @Post('/getOne')
    @HttpCode(HttpStatus.OK)
    getOne(@Body('animeId') animeId, @Body('season') season, @Body('episode') episode): Promise<Video>{
        return this.videoService.getOne(animeId, season, episode)
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createVideoDto: CreateVideoDto, @Body('token') token): Promise<Video>{
        return this.videoService.create(createVideoDto, token)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    remove(@Param('id') id: string, @Body('token') token): Promise<Video>{
        return this.videoService.removeById(id, token)
    }

    @Post('/uploadVideo')
    @UseInterceptors(FilesInterceptor('video'))
    @UseInterceptors(FilesInterceptor('preview'))
    @UseInterceptors(FilesInterceptor('image'))
    uploadFile(@UploadedFiles() video, @UploadedFiles() preview, @UploadedFiles() image, @Body('token') token){
        return this.videoService.uploadVideo(token, video, preview, image)
    }

    @Get('/getVideo/:videoPath')
    getVideo(@Param('videoPath') video,@Res() res) {
        res.sendFile(video, {root: 'uploads'})
    }
}
