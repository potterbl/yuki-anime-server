import {Body, Injectable, UnauthorizedException} from '@nestjs/common';
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
    
    async getAll() {
        return this.collectionModel.find().exec()
    }

    async getById(id: string) {
        return this.collectionModel.findById(id)
    }

    async getMultiply(collections: string[]) {
        const result: object[] = [];
        for (const id of collections) {
            const item = await this.collectionModel.findOne({ _id: id });
            result.push(item);
        }
        return result;
    }

    async create(createCollectionDto: CreateCollectionDto, token) {
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        if (decodedToken) {
            // Теперь вы можете использовать decodedToken для доступа к данным в токене
            const newCollection = new this.collectionModel(createCollectionDto);
            return newCollection.save();
        } else {
            throw new UnauthorizedException();
        }
    }

    async update(updateCollectionDto: UpdateCollectionDto, id, token) {
        const candidate = jwt.verify(token, process.env.JWT_KEY)
        if(candidate){
            return this.collectionModel.findByIdAndUpdate(id, updateCollectionDto)
        } else {
            throw new Error('Пользователь не авторизован')
        }
    }

    async remove(id: string, token) {
        const candidate = jwt.verify(token, process.env.JWT_KEY)
        if(candidate){
            return this.collectionModel.findByIdAndDelete(id)
        } else {
            throw new Error('Пользователь не авторизован')
        }
    }
}
