import {Body, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Collection, CollectionDocument} from "./schemas/collection.schema";
import {Model} from "mongoose";
import {CreateCollectionDto} from "./dto/create-collection.dto";
import {UpdateCollectionDto} from "./dto/update-collection.dto";
import * as jwt from 'jsonwebtoken'

@Injectable()
export class CollectionsService {
    
    constructor(@InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>) {
    }
    
    async getAll(): Promise<Collection[] | Collection> {
        return this.collectionModel.find().exec()
    }

    async getById(id: string): Promise<Collection> {
        return this.collectionModel.findById({_id: id})
    }

    async getMultiply(collections: string[]): Promise<Collection[]> {
        const result: Collection[] = [];
        for (const id of collections) {
            const item = await this.collectionModel.findOne({ _id: id });
            result.push(item);
        }
        return result;
    }

    async create(createCollectionDto: CreateCollectionDto, token): Promise<Collection> {
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);

        const id = decodedToken["_id"]
        if (id === '64e3500d5aecf660abf0ede2') {
            const newCollection = new this.collectionModel(createCollectionDto);
            return newCollection.save();
        } else {
            throw new UnauthorizedException();
        }
    }

    async update(updateCollectionDto: UpdateCollectionDto, id, token): Promise<Collection> {
        const candidate = jwt.verify(token, process.env.JWT_KEY)
        const candidateId = candidate["_id"]
        if (candidateId === '64e3500d5aecf660abf0ede2') {
            if(this.collectionModel.findById(id)){
                return this.collectionModel.findByIdAndUpdate(id, updateCollectionDto)
            } else {
                throw new NotFoundException()
            }
        } else {
            throw new UnauthorizedException()
        }
    }

    async updatePopularity(animeId): Promise<Collection> {
        const anime = await this.collectionModel.findOne({_id: animeId})

        if(anime) {
            anime.likes = anime.likes + 1

            await anime.save()

            return anime
        }
    }

    async getPopular(): Promise<Collection[]> {
        return await this.collectionModel
            .find()
            .sort({ likes: -1 })
            .limit(9)
            .exec();
    }

    async remove(id: string, token): Promise<Collection> {
        const candidate = jwt.verify(token, process.env.JWT_KEY)
        const candidateId = candidate["_id"]
        if (candidateId === '64e3500d5aecf660abf0ede2') {
            if(this.collectionModel.findById(id)){
                return this.collectionModel.findByIdAndDelete(id)
            } else {
                throw new NotFoundException()
            }
        } else {
            throw new UnauthorizedException()
        }
    }
}
