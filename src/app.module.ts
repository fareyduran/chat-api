import { MessagesModule } from '@messages/messages.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsModule } from '@rooms/rooms.module';
import { UsersModule } from '@users/users.module';

const MODULES = [
  UsersModule,
  RoomsModule,
  MessagesModule
]

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    CqrsModule.forRoot(),
    ...MODULES
  ],
})
export class AppModule { }
