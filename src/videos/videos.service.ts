import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Video, VideoDocument} from "./schemas/video.schema";
import {Model} from "mongoose";
import {CreateVideoDto} from "./videoDto/create-video.dto";

@Injectable()
export class VideosService{
    constructor(@InjectModel(Video.name) private videoModel: Model<VideoDocument>) {
    }

    async getAll(): Promise<Video[]> {
        return this.videoModel.find().exec()
    }

    async getById(id: string): Promise<Video> {
        return this.videoModel.findById(id)
    }

    async create(videoDto: CreateVideoDto): Promise<Video> {
        const newVideo = new this.videoModel(videoDto)
        return newVideo.save()
    }

    async removeById(id: string): Promise<Video> {
        return this.videoModel.findByIdAndDelete(id)
    }
}