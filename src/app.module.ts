import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideosModule } from './videos/videos.module';
import { CollectionsModule } from './collections/collections.module';
import { AuthModule } from './auth/auth.module';
import {MulterModule, MulterModuleOptions} from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGOOSE_URI),
    MulterModule.registerAsync({
      useFactory: () => {
        const storageOptions: MulterModuleOptions['storage'] = diskStorage({
          destination: './uploads',
          filename: (_, file, callback) => {
            const name = file.originalname.split('.')[0];
            const fileExtName = extname(file.originalname);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(null, `${name}-${uniqueSuffix}${fileExtName}`);
          },
        });
        return {
          storage: storageOptions,
        };
      },
    }),
    CollectionsModule,
    VideosModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
