import {Injectable, UnauthorizedException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import * as jwt from 'jsonwebtoken'
import {Video, VideoDocument} from "./schemas/video.schema";
import {CreateVideoDto} from "./videoDto/create-video.dto";
import {Account, AccountDocument} from "../auth/schemas/account.schema";

@Injectable()
export class VideosService{
    constructor(@InjectModel(Video.name) private videoModel: Model<VideoDocument>, @InjectModel(Account.name) private accountModel: Model<AccountDocument>) {
    }
    async getAll(): Promise<Video[]> {
        return this.videoModel.find().exec()
    }

    async getById(animeId: string): Promise<Video[] | Video> {
        return this.videoModel.find({animeId}).exec()
    }

    async getOne(animeId, season, episode): Promise<Video> {
        return this.videoModel.findOne({animeId, season, episode})
    }

    async create(videoDto: CreateVideoDto, token): Promise<Video> {
        try{
            const candidate = jwt.verify(token, process.env.JWT_KEY)

            const candidateId = candidate["_id"]
            if(candidateId === '64e3500d5aecf660abf0ede2'){
                const newVideo = new this.videoModel(videoDto)
                return newVideo.save()
            } else {
                throw new UnauthorizedException()
            }
        } catch(e) {
            throw new UnauthorizedException()
        }
    }

    async removeById(id: string, token: string): Promise<Video> {
        try{
            const candidate = jwt.verify(token, process.env.JWT_KEY)

            const candidateId = candidate["_id"]
            if(candidateId === '64e3500d5aecf660abf0ede2'){
                return this.videoModel.findByIdAndDelete(id)
            } else {
                throw new UnauthorizedException()
            }
        } catch(e) {
            throw new UnauthorizedException()
        }
    }

    async uploadVideo(token, video, preview, image){
        try{
            const candidate = jwt.verify(token, process.env.JWT_KEY)

            const candidateId = candidate["_id"]
            console.log(candidateId)
            console.log(candidateId === '64e3500d5aecf660abf0ede2')
            if(candidateId === '64e3500d5aecf660abf0ede2'){
                console.log(video)
                console.log(preview)
                console.log(image)
            } else {
                throw new UnauthorizedException()
            }
        } catch(err) {
            throw new UnauthorizedException()
        }
    }
}