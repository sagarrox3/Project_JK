import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceController } from './provider/service/service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './module/users.module';
import { BlogsModule } from './module/blogs.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_HOST),
    UsersModule,
    BlogsModule,
    AuthModule,
  ],
  controllers: [AppController, ServiceController],
  providers: [AppService],
})
export class AppModule {}
