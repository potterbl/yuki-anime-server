import {Body, Controller, Delete, Get, Param, Patch, Post, Put} from '@nestjs/common';
import {CollectionsService} from "./collections.service";
import {CreateCollectionDto} from "./dto/create-collection.dto";
import {UpdateCollectionDto} from "./dto/update-collection.dto";
import {Collection} from "./schemas/collection.schema";

@Controller('collections')
export class CollectionsController {
    constructor(private readonly collectionService: CollectionsService) {
    }

    @Get()
    getAll(): Promise<Collection | Collection[]> {
        return this.collectionService.getAll()
    }

    @Get('/id/:id')
    getById(@Param('id') id): Promise<Collection> {
        return this.collectionService.getById(id)
    }

    @Post('/multiply')
    getMultiply(@Body('collections') collections): Promise<Collection[]>{
        return this.collectionService.getMultiply(collections)
    }

    @Get('/popular')
    getPopular(): Promise<Collection[]> {
        return this.collectionService.getPopular()
    }

    @Patch('/updatePopularity')
    updatePopularity(@Body('animeId') animeId): Promise<Collection> {
        return this.collectionService.updatePopularity(animeId)
    }

    @Post()
    create(@Body() createCollectionDto: CreateCollectionDto, @Body('token') token): Promise<Collection> {
        return this.collectionService.create(createCollectionDto, token)
    }

    @Patch(':id')
    update(@Body() updateCollectionDto: UpdateCollectionDto, @Param('id') id, @Body('token') token): Promise<Collection> {
        return this.collectionService.update(updateCollectionDto, id, token)
    }

    @Delete(':id')
    remove(@Param('id') id, @Body('token') token): Promise<Collection> {
        return this.collectionService.remove(id, token)
    }
}
