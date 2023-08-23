import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {LoginAuthDto} from "./dto/login-auth.dto";
import {RegistrationAuthDto} from "./dto/registration-auth.dto";
import {Account, AccountDocument, historyType} from "./schemas/account.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {

    constructor(@InjectModel(Account.name) private accountModel: Model<AccountDocument>) {
    }

    async login(loginDto: LoginAuthDto) {
        const candidate = loginDto.login
        const isExist = await this.accountModel.findOne({login: candidate}).exec()

        if (!isExist) {
            throw new UnauthorizedException()
        } else if (isExist && isExist.password === loginDto.password) {
            const payload = {
                _id: isExist._id,
                name: isExist.name,
                avatar: isExist.avatar,
                history: isExist.history,
                likes: isExist.likes,
                dislikes: isExist.dislikes
            };

            return {token: jwt.sign(payload, process.env.JWT_KEY, {expiresIn: '14d'})}
        } else if(isExist && isExist.password !== loginDto.password) {
            throw new UnauthorizedException()
        }
    }

    async registration(registrationDto: RegistrationAuthDto) {
        const candidate = registrationDto.login;
        const existingAccount = await this.accountModel.findOne({login: candidate}).exec();

        if (existingAccount) {
            throw new NotFoundException();
        } else {
            const newAccount = new this.accountModel(registrationDto);
            await newAccount.save();

            const payload = {
                _id: newAccount._id,
                name: newAccount.name,
                avatar: newAccount.avatar,
                history: newAccount.history,
                likes: newAccount.likes,
                dislikes: newAccount.dislikes
            };

            return {token: jwt.sign(payload, process.env.JWT_KEY, {expiresIn: '14d'})}
        }
    }

    async getMe(token: string) {
        try {
            return jwt.verify(token, process.env.JWT_KEY);
        } catch (err) {
            throw new UnauthorizedException()
        }
    }

    async updateHistory(token: string, animeId: string, season: string, episode: string) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_KEY) as { _id: string } | null;

            if (decodedToken) {
                const {_id} = decodedToken;

                const user = await this.accountModel.findOne({_id});

                if (user) {
                    const existingHistoryIndex = user.history.findIndex(historyItem => historyItem.animeId === animeId);

                    const historyItem = {
                        animeId,
                        season,
                        episode
                    };

                    if (existingHistoryIndex !== -1) {
                        user.history.splice(existingHistoryIndex, 1);
                        user.history.unshift(historyItem)
                    } else {
                        user.history.unshift(historyItem);
                    }

                    user.save()

                    const payload = {
                        _id: user._id,
                        avatar: user.avatar,
                        history: user.history,
                        likes: user.likes,
                        dislikes: user.dislikes
                    };

                    return {token: jwt.sign(payload, process.env.JWT_KEY, {expiresIn: '14d'})}
                } else {
                    throw new UnauthorizedException();
                }
            } else {
                throw new UnauthorizedException();
            }
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}
