import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {LoginAuthDto} from "./dto/login-auth.dto";
import {RegistrationAuthDto} from "./dto/registration-auth.dto";
import {Account, AccountDocument, historyType} from "./schemas/account.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import * as jwt from 'jsonwebtoken';
import {MailerService} from "@nestjs-modules/mailer";

@Injectable()
export class AuthService {

    constructor(@InjectModel(Account.name) private accountModel: Model<AccountDocument>, private readonly mailerService: MailerService) {
    }

    async login(loginDto: LoginAuthDto): Promise<{token: string}>{
        const candidate = loginDto.login
        const isExist = await this.accountModel.findOne({login: candidate}).exec()

        if (!isExist) {
            throw new UnauthorizedException()
        } else if (isExist && isExist.password === loginDto.password) {
            const payload = {
                _id: isExist._id,
                history: isExist.history,
                likes: isExist.likes,
                dislikes: isExist.dislikes
            };

            return {token: jwt.sign(payload, process.env.JWT_KEY, {expiresIn: '14d'})}
        } else if(isExist && isExist.password !== loginDto.password) {
            throw new UnauthorizedException()
        }
    }

    async registration(registrationDto: RegistrationAuthDto): Promise<{token: string}>{
        const candidate = registrationDto.login;
        const existingAccount = await this.accountModel.findOne({login: candidate}).exec();

        if (existingAccount) {
            throw new NotFoundException();
        } else {
            const newAccount = new this.accountModel(registrationDto);
            await newAccount.save();

            const payload = {
                _id: newAccount._id,
                history: newAccount.history,
                likes: newAccount.likes,
                dislikes: newAccount.dislikes
            };

            return {token: jwt.sign(payload, process.env.JWT_KEY, {expiresIn: '14d'})}
        }
    }

    async getMe(token: string): Promise<string | jwt.JwtPayload> {
        try {
            return jwt.verify(token, process.env.JWT_KEY);
        } catch (err) {
            throw new UnauthorizedException()
        }
    }

    async updateHistory(token: string, animeId: string, season: string, episode: string): Promise<{token: string}> {
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

    async resetMailSend(email): Promise<{message: string}> {
        const candidate = await this.accountModel.findOne({login: email}).exec();

            if(candidate){
                const payload = {
                    _id: candidate._id,
                    login: candidate.login,
                    updatable: true
                }

                const jwtToken = jwt.sign(payload, process.env.JWT_KEY, {expiresIn: '30m'})

                await this.mailerService
                    .sendMail({
                        to: email,
                        from: 'yuki.anime.general@gmail.com',
                        subject: 'Reset password',
                        text: 'Your reset link... \n' +
                            `http://localhost:4000/reset/${jwtToken}`
                    })
                    .then(res => {
                        console.log(res)
                    })
                    .catch(err => {
                        throw new Error()
                    })
                return {message: 'Письмо отправленно. Проверьте вашу почту'}
            } else{
                throw new NotFoundException()
            }
    }

    async resetPassword(token, newPassword): Promise<{token: string}> {
        const candidate = jwt.verify(token, process.env.JWT_KEY);

        if (candidate) {
            if (candidate["updatable"] === true) {
                const updatedCandidate = await this.accountModel.findByIdAndUpdate(
                    candidate["_id"],
                    { password: newPassword },
                    { new: true }
                ).exec();

                if (updatedCandidate) {
                    const payload = {
                        _id: updatedCandidate._id,
                        history: updatedCandidate.history,
                        likes: updatedCandidate.likes,
                        dislikes: updatedCandidate.dislikes
                    };

                    return {
                        token: jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '14d' })
                    };
                } else {
                    throw new NotFoundException();
                }
            } else {
                throw new UnauthorizedException();
            }
        } else {
            throw new UnauthorizedException();
        }
    }

}
