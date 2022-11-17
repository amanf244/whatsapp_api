import { Module } from '@nestjs/common';
import { ChatController } from './controllers/chat.controller';

@Module({
  controllers: [ChatController],
})
export class ChatModule {}
