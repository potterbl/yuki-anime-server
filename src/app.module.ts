import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideosModule } from './videos/videos.module';
import { CollectionsModule } from './collections/collections.module';
import { AuthModule } from './auth/auth.module';
import {MulterModule} from "@nestjs/platform-express";

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGOOSE_URI),
      MulterModule.register({
        dest: './uploads',
      }),
    CollectionsModule,
    VideosModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
