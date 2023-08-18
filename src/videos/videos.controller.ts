import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post} from '@nestjs/common';
import {CreateVideoDto} from "./videoDto/create-video.dto";
import {VideosService} from "./videos.service";
import {Video} from "./schemas/video.schema";

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
    getById(@Param('id') id: string): Promise<Video>{
        return this.videoService.getById(id)
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createVideoDto: CreateVideoDto): Promise<Video>{
        return this.videoService.create(createVideoDto)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    remove(@Param('id') id: string): Promise<Video>{
        return this.videoService.removeById(id)
    }
}
